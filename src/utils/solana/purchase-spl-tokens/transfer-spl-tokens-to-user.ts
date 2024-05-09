import _ from "lodash"
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js"
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token"
import SecretsManager from "../../../classes/secrets-manager"
import { getWalletBalanceWithUSD } from "../get-wallet-balance"
import calculateTransactionFee from "../calculate-transaction-fee"
import GetKeypairFromSecretKey from "../get-keypair-from-secret-key"
import EscrowWalletManager from "../../../classes/escrow-wallet-manager"
import updateSplListingStatus from "../../../db-operations/write/spl/update-spl-listing-status"
import addTokenAccountRecord from "../../../db-operations/write/token-account/add-token-account-record"
import retrieveTokenAccountBySplAddress from "../../../db-operations/read/token-account/retrieve-token-account-by-spl-address"
import addSplTransferRecordAndUpdateOwnership from "../../../db-operations/write/simultaneous-writes/add-spl-transfer-and-update-ownership"

// eslint-disable-next-line max-lines-per-function
export default async function transferSplTokensToUser(
	solanaWallet: ExtendedSolanaWallet,
	purchaseSplTokensData: PurchasePrimarySPLTokensData,
	splId: number
): Promise<number> {
	try {
		const connection = new Connection(clusterApiUrl("devnet"), "confirmed")
		const fortunaWallet = await GetKeypairFromSecretKey.getFortunaSolanaWalletFromSecretKey()

		// Check if the user has a token account with the db.
		let userHasExistingTokenAccount = true
		let userTokenAccount = await retrieveTokenAccountBySplAddress(purchaseSplTokensData.splPublicKey, solanaWallet.public_key)

		if (_.isNull(userTokenAccount)) {
			userHasExistingTokenAccount = false
			const initialWalletBalance = await getWalletBalanceWithUSD(fortunaWallet.publicKey)
			const newTokenAccount = await getOrCreateAssociatedTokenAccount(
				connection,
				fortunaWallet,
				new PublicKey(purchaseSplTokensData.splPublicKey),
				new PublicKey(solanaWallet.public_key)
			)
			const secondWalletBalance = await getWalletBalanceWithUSD(fortunaWallet.publicKey)

			const tokenAccount = await addTokenAccountRecord(
				splId,
				solanaWallet.solana_wallet_id,
				newTokenAccount.address,
				initialWalletBalance.balanceInSol - secondWalletBalance.balanceInSol,
				initialWalletBalance.balanceInUsd - secondWalletBalance.balanceInUsd,
			)
			userTokenAccount = tokenAccount
		}

		const { FORTUNA_ESCROW_WALLET_PUBLIC_KEY, FORTUNA_ESCROW_SOLANA_WALLET_ID_DB } = await SecretsManager.getInstance().getSecrets(
			["FORTUNA_ESCROW_WALLET_PUBLIC_KEY", "FORTUNA_ESCROW_SOLANA_WALLET_ID_DB"]
		)
		const fortunaEscrowTokenAccount = await retrieveTokenAccountBySplAddress(
			purchaseSplTokensData.splPublicKey,
			FORTUNA_ESCROW_WALLET_PUBLIC_KEY
		)

		if (_.isNull(fortunaEscrowTokenAccount)) throw Error("Unable to find Escrow Token Account in DB")

		const fortunaEscrowWallet = await GetKeypairFromSecretKey.getFortunaEscrowSolanaWalletFromSecretKey()
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
			parseInt(FORTUNA_ESCROW_SOLANA_WALLET_ID_DB, 10),
			fortunaEscrowTokenAccount.token_account_id,
			true,
			false,
			purchaseSplTokensData.numberOfTokensPurchasing,
			transferFeeSol,
			userHasExistingTokenAccount
		)

		const tokensRemainingInEscrow = await EscrowWalletManager.getInstance().decrementTokenAmount(
			purchaseSplTokensData.splPublicKey,
			purchaseSplTokensData.numberOfTokensPurchasing
		)

		if (tokensRemainingInEscrow === 0) await updateSplListingStatus(splId, "SOLDOUT")

		return splTransferId
	} catch (error) {
		console.error(error)
		throw error
	}
}
