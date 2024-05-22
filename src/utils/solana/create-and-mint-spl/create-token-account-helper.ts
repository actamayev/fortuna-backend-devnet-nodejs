import { createAssociatedTokenAccount } from "@solana/spl-token"
import { Connection, Keypair, PublicKey, clusterApiUrl } from "@solana/web3.js"
import { getWalletBalanceWithUSD } from "../get-wallet-balance"
import addTokenAccountRecord from "../../../db-operations/write/token-account/add-token-account-record"
import determineTransactionFee from "../determine-transaction-fee"
import calculateTransactionFee from "../calculate-transaction-fee"

export default async function createTokenAccountHelper(
	fortunaFeePayerWallet: Keypair,
	splId: number,
	splTokenPublicKey: PublicKey,
	userPublicKey: PublicKey,
	userWalletIdIdb: number
): Promise<{ tokenAccountIdDb: number, accountAddress: PublicKey }> {
	try {
		const connection = new Connection(clusterApiUrl("devnet"), "confirmed")
		const initialWalletBalance = await getWalletBalanceWithUSD(fortunaFeePayerWallet.publicKey)

		const tokenAccountAddress = await createAssociatedTokenAccount(
			connection,
			fortunaFeePayerWallet,
			splTokenPublicKey,
			userPublicKey
		)

		const secondWalletBalance = await getWalletBalanceWithUSD(fortunaFeePayerWallet.publicKey)
		console.log("sol price diff", initialWalletBalance.balanceInSol - secondWalletBalance.balanceInSol)

		console.log("usd price diff", initialWalletBalance.balanceInUsd - secondWalletBalance.balanceInUsd)
		const transactionFee = await calculateTransactionFee(tokenAccountAddress.toString())
		console.log("transactionFee", transactionFee)

		const fortunaTokenAccountDB = await addTokenAccountRecord(
			splId,
			userWalletIdIdb,
			tokenAccountAddress,
			initialWalletBalance.balanceInSol - secondWalletBalance.balanceInSol,
			initialWalletBalance.balanceInUsd - secondWalletBalance.balanceInUsd
		)

		return {
			tokenAccountIdDb: fortunaTokenAccountDB.token_account_id,
			accountAddress: tokenAccountAddress
		}
	} catch (error) {
		console.error(error)
		throw error
	}
}
