import _ from "lodash"
import { Connection, LAMPORTS_PER_SOL, PublicKey, clusterApiUrl } from "@solana/web3.js"

// TODO: Delete this file, it is for testing purposes, while I try to figure out why minting an NFT costs $1
export default async function printWalletBalance(initialLogMessage: string): Promise<void> {
	try {
		const connection = new Connection(clusterApiUrl("devnet"), "confirmed")

		const publicKey = new PublicKey("HgE67Sn8bQhSD21m6XYb6eJNUsrnV1TQ4kTWG17LAdxC")

		const balanceInLamports = await connection.getBalance(publicKey)
		const balanceInSol = balanceInLamports / LAMPORTS_PER_SOL
		const solPriceInUSD = 175

		if (_.isNull(solPriceInUSD)) return

		console.log(initialLogMessage)
		console.log("balanceInSol:",balanceInSol)
		console.log("balance in USD:", balanceInSol * solPriceInUSD)
		console.log("------------------------------------------------")
	} catch (error) {
		console.error(error)
	}
}
