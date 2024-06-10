import _ from "lodash"
import { Connection, LAMPORTS_PER_SOL, clusterApiUrl } from "@solana/web3.js"
import GetKeypairFromSecretKey from "./get-keypair-from-secret-key"

// This file is for testing purposes
export default async function printWalletBalance(initialLogMessage: string): Promise<void> {
	try {
		const connection = new Connection(clusterApiUrl("devnet"), "confirmed")
		const fortunaFeePayerKeypair = await GetKeypairFromSecretKey.getFortunaFeePayerWalletKeypair()

		const balanceInLamports = await connection.getBalance(fortunaFeePayerKeypair.publicKey)
		const balanceInSol = balanceInLamports / LAMPORTS_PER_SOL
		const solPriceInUSD = 175

		if (_.isNull(solPriceInUSD)) return

		console.info(initialLogMessage)
		console.info("balanceInSol:",balanceInSol)
		console.info("balance in USD:", balanceInSol * solPriceInUSD)
		console.info("------------------------------------------------")
	} catch (error) {
		console.error(error)
		throw error
	}
}
