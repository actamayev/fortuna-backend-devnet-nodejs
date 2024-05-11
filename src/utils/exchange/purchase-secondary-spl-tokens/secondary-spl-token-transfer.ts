import _ from "lodash"
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js"
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token"
import { getWalletBalanceWithUSD } from "../../solana/get-wallet-balance"
import calculateTransactionFee from "../../solana/calculate-transaction-fee"
import GetKeypairFromSecretKey from "../../solana/get-keypair-from-secret-key"
import addTokenAccountRecord from "../../../db-operations/write/token-account/add-token-account-record"
import retrieveTokenAccountBySplAddress from "../../../db-operations/read/token-account/retrieve-token-account-by-spl-address"
import addSplTransferRecordAndUpdateOwnership from "../../../db-operations/write/simultaneous-writes/add-spl-transfer-and-update-ownership"

// eslint-disable-next-line max-lines-per-function
export default async function secondarySplTokenTransfer(
	transferFromWallet: ExtendedSolanaWallet,
	transferToWallet: ExtendedSolanaWallet,
	numberOfTokensPurchasing: number,
	splDetails: SplByPublicKeyData
): Promise<number> {
	try {
		const connection = new Connection(clusterApiUrl("devnet"), "confirmed")
		const fortunaWallet = await GetKeypairFromSecretKey.getFortunaWalletKeypair()

		let userHasExistingTokenAccount = true
		let userTokenAccount = await retrieveTokenAccountBySplAddress(splDetails.publicKeyAddress, transferToWallet.public_key)

		if (_.isNull(userTokenAccount)) {
			userHasExistingTokenAccount = false
			const initialWalletBalance = await getWalletBalanceWithUSD(fortunaWallet.publicKey)
			const newTokenAccount = await getOrCreateAssociatedTokenAccount(
				connection,
				fortunaWallet,
				new PublicKey(splDetails.publicKeyAddress),
				new PublicKey(transferToWallet.public_key)
			)
			const secondWalletBalance = await getWalletBalanceWithUSD(fortunaWallet.publicKey)

			const tokenAccount = await addTokenAccountRecord(
				splDetails.splId,
				transferToWallet.solana_wallet_id,
				newTokenAccount.address,
				initialWalletBalance.balanceInSol - secondWalletBalance.balanceInSol,
				initialWalletBalance.balanceInUsd - secondWalletBalance.balanceInUsd,
			)
			userTokenAccount = tokenAccount
		}

		const transferFromTokenAccount = await retrieveTokenAccountBySplAddress(splDetails.publicKeyAddress, transferFromWallet.public_key)

		if (_.isNull(transferFromTokenAccount)) throw Error("Unable to find Sender Token Account in DB")

		const transferFromKeypair = await GetKeypairFromSecretKey.getKeypairFromEncryptedSecretKey(transferFromWallet.secret_key__encrypted)

		const transactionSignature = await transfer(
			connection,
			fortunaWallet,
			new PublicKey(transferFromTokenAccount.public_key), // change  this to transfer from token account
			new PublicKey(userTokenAccount.public_key),
			transferFromKeypair,
			numberOfTokensPurchasing
		)

		const transferFeeSol = await calculateTransactionFee(transactionSignature)

		const splTransferId = await addSplTransferRecordAndUpdateOwnership(
			splDetails.splId,
			transactionSignature,
			transferToWallet.solana_wallet_id,
			userTokenAccount.token_account_id,
			transferFromWallet.solana_wallet_id,
			transferFromTokenAccount.token_account_id,
			true,
			true,
			numberOfTokensPurchasing,
			transferFeeSol,
			userHasExistingTokenAccount
		)

		return splTransferId
	} catch (error) {
		console.error(error)
		throw error
	}
}
