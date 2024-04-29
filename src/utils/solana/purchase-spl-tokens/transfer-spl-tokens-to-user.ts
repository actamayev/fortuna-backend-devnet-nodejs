import _ from "lodash"
import { solana_wallet } from "@prisma/client"
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js"
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token"
import { getWalletBalanceWithUSD } from "../get-wallet-balance"
import calculateTransactionFee from "../calculate-transaction-fee"
import EscrowWalletManager from "../../../classes/escrow-wallet-manager"
import addTokenAccountRecord from "../../db-operations/write/token-account/add-token-account-record"
import retrieveTokenAccountBySplAddress from "../../db-operations/read/token-account/retrieve-token-account-by-spl-address"
import addSplTransferRecordAndUpdateOwnership from "../../db-operations/write/simultaneous-writes/add-spl-transfer-and-update-ownership"
import { getFortunaEscrowSolanaWalletFromSecretKey, getFortunaSolanaWalletFromSecretKey} from "../get-fortuna-solana-wallet-from-secret-key"

// eslint-disable-next-line max-lines-per-function
export default async function transferSplTokensToUser(
	solanaWallet: solana_wallet,
	purchaseSplTokensData: PurchaseSPLTokensData,
	splId: number
): Promise<number> {
	try {
		const connection = new Connection(clusterApiUrl("devnet"), "confirmed")
		const fortunaWallet = getFortunaSolanaWalletFromSecretKey()

		// Check if the user has a token account with the db.
		let userHasExistingTokenAccount = true
		let userTokenAccount = await retrieveTokenAccountBySplAddress(purchaseSplTokensData.splPublicKey, solanaWallet.public_key)
		if (_.isNull(userTokenAccount)) {
			userHasExistingTokenAccount = false
			const initialWalletBalance = await getWalletBalanceWithUSD(process.env.FORTUNA_WALLET_PUBLIC_KEY)
			const newTokenAccount = await getOrCreateAssociatedTokenAccount(
				connection,
				fortunaWallet,
				new PublicKey(purchaseSplTokensData.splPublicKey),
				new PublicKey(solanaWallet.public_key)
			)
			const secondWalletBalance = await getWalletBalanceWithUSD(process.env.FORTUNA_WALLET_PUBLIC_KEY)

			const tokenAccount = await addTokenAccountRecord(
				splId,
				solanaWallet.solana_wallet_id,
				newTokenAccount.address,
				initialWalletBalance.balanceInSol - secondWalletBalance.balanceInSol,
				initialWalletBalance.balanceInUsd - secondWalletBalance.balanceInUsd,
			)
			userTokenAccount = tokenAccount
		}

		const fortunaEscrowTokenAccount = await retrieveTokenAccountBySplAddress(
			purchaseSplTokensData.splPublicKey,
			process.env.FORTUNA_ESCROW_WALLET_PUBLIC_KEY
		)

		if (_.isNull(fortunaEscrowTokenAccount)) throw Error("Unable to find Escrow Token Account in DB")

		const fortunaEscrowWallet = getFortunaEscrowSolanaWalletFromSecretKey()
		const transactionSignature = await transfer(
			connection,
			fortunaWallet,
			new PublicKey(fortunaEscrowTokenAccount.public_key),
			new PublicKey(userTokenAccount.public_key),
			fortunaEscrowWallet,
			purchaseSplTokensData.numberOfTokensPurchasing
		)

		const transferFeeSol = await calculateTransactionFee(transactionSignature)

		const splTransferId = await addSplTransferRecordAndUpdateOwnership(
			splId,
			transactionSignature,
			solanaWallet.solana_wallet_id,
			userTokenAccount.token_account_id,
			Number(process.env.FORTUNA_ESCROW_SOLANA_WALLET_ID_DB),
			fortunaEscrowTokenAccount.token_account_id,
			true,
			purchaseSplTokensData.numberOfTokensPurchasing,
			transferFeeSol,
			userHasExistingTokenAccount
		)

		await EscrowWalletManager.getInstance().decrementTokenAmount(
			purchaseSplTokensData.splPublicKey,
			purchaseSplTokensData.numberOfTokensPurchasing
		)

		return splTransferId
	} catch (error) {
		console.error(error)
		throw error
	}
}
