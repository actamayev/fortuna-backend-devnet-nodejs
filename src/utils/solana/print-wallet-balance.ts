import _ from "lodash"
import { Connection, LAMPORTS_PER_SOL, PublicKey, clusterApiUrl } from "@solana/web3.js"

// This file is for testing purposes
export default async function printWalletBalance(initialLogMessage: string): Promise<void> {
	try {
		const connection = new Connection(clusterApiUrl("devnet"), "confirmed")

		const publicKey = new PublicKey("HgE67Sn8bQhSD21m6XYb6eJNUsrnV1TQ4kTWG17LAdxC")

		const balanceInLamports = await connection.getBalance(publicKey)
		const balanceInSol = balanceInLamports / LAMPORTS_PER_SOL
		const solPriceInUSD = 175

		if (_.isNull(solPriceInUSD)) return

		console.info(initialLogMessage)
		console.info("balanceInSol:",balanceInSol)
		console.info("balance in USD:", balanceInSol * solPriceInUSD)
		console.info("------------------------------------------------")
	} catch (error) {
		console.error(error)
	}
}
