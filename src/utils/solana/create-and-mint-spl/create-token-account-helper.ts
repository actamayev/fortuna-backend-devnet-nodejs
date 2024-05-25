import { createAssociatedTokenAccount, getMinimumBalanceForRentExemptAccount } from "@solana/spl-token"
import { Connection, Keypair, PublicKey, clusterApiUrl } from "@solana/web3.js"
import { getWalletBalanceWithUSD } from "../get-wallet-balance"
import addTokenAccountRecord from "../../../db-operations/write/token-account/add-token-account-record"

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

		// console.log("wallet dif", initialWalletBalance.balanceInSol - secondWalletBalance.balanceInSol)
		// const rentExemptAmount = await getMinimumBalanceForRentExemptAccount(connection, "confirmed")
		// console.log("rentExemptAmount", rentExemptAmount)

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
