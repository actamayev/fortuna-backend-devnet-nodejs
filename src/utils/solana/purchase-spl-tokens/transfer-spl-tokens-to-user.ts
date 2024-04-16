import _ from "lodash"
import { solana_wallet } from "@prisma/client"
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js"
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token"
import { getWalletBalanceWithUSD } from "../get-wallet-balance"
import calculateTransactionFee from "../calculate-transaction-fee"
import addSplTransferRecord from "../../db-operations/write/spl-transfer/add-spl-transfer-record"
import { getFortunaEscrowSolanaWalletFromSecretKey, getFortunaSolanaWalletFromSecretKey }
	from "../get-fortuna-solana-wallet-from-secret-key"
import addTokenAccountRecord from "../../db-operations/write/token-account/add-token-account-record"
import retrieveTokenAccountBySplAddress from "../../db-operations/read/token-account/retrieve-token-account-by-spl-address"
import updateSplOwnershipRecord from "../../db-operations/write/spl/spl-ownership/update-spl-ownership-record"
import addSPLOwnershipRecord from "../../db-operations/write/spl/spl-ownership/add-spl-ownership-record"

// eslint-disable-next-line max-lines-per-function
export default async function transferSplTokensToUser(
	solanaWallet: solana_wallet,
	purchaseSplTokensData: PurchaseSPLTokensData,
	splDetails: RetrieveSplByPublicKey
): Promise<number> {
	try {
		const connection = new Connection(clusterApiUrl("devnet"), "confirmed")
		const fortunaWallet = getFortunaSolanaWalletFromSecretKey()

		// check if the user has a token account with the db.
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
				splDetails.splId,
				solanaWallet.solana_wallet_id,
				newTokenAccount.address,
				initialWalletBalance.balanceInSol - secondWalletBalance.balanceInSol,
				initialWalletBalance.balanceInUsd - secondWalletBalance.balanceInUsd,
				Number(process.env.FORTUNA_SOLANA_WALLET_ID_DB)
			)
			userTokenAccount = tokenAccount
		}

		const fortunaEscrowTokenAccount = await retrieveTokenAccountBySplAddress(
			purchaseSplTokensData.splPublicKey, process.env.FORTUNA_ESCROW_WALLET_PUBLIC_KEY
		)

		if (_.isNull(fortunaEscrowTokenAccount)) throw Error("Unable to find Escrow Wallet in DB")

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

		const splTransferId = await addSplTransferRecord(
			splDetails.splId,
			transactionSignature,
			solanaWallet.solana_wallet_id,
			userTokenAccount.token_account_id,
			Number(process.env.FORTUNA_ESCROW_SOLANA_WALLET_ID_DB),
			fortunaEscrowTokenAccount.token_account_id,
			true,
			purchaseSplTokensData.numberOfTokensPurchasing,
			transferFeeSol,
			Number(process.env.FORTUNA_SOLANA_WALLET_ID_DB)
		)

		// Adds/updates an ownership record for the user:
		if (userHasExistingTokenAccount === true) {
			await updateSplOwnershipRecord(
				splDetails.splId,
				userTokenAccount.token_account_id,
				purchaseSplTokensData.numberOfTokensPurchasing,
				"add"
			)
		} else {
			await addSPLOwnershipRecord(
				splDetails.splId,
				userTokenAccount.token_account_id,
				purchaseSplTokensData.numberOfTokensPurchasing
			)
		}
		// Updates escrow's ownership record:
		await updateSplOwnershipRecord(
			splDetails.splId,
			fortunaEscrowTokenAccount.token_account_id,
			purchaseSplTokensData.numberOfTokensPurchasing,
			"subtract"
		)

		return splTransferId
	} catch (error) {
		console.error(error)
		throw error
	}
}
