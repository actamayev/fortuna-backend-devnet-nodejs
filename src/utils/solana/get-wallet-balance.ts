import { Connection, LAMPORTS_PER_SOL, PublicKey, clusterApiUrl } from "@solana/web3.js"
import SolPriceManager from "../../classes/solana/sol-price-manager"

interface WalletBalanceDetails {
	balanceInSol: number
	balanceInUsd: number
	solPriceInUSD: number
	solPriceRetrievedTime: Date
}

export async function getWalletBalanceWithUSD(publicKey: PublicKey): Promise<WalletBalanceDetails> {
	try {
		const balanceInSol = await getWalletBalanceSol(publicKey)
		const solPriceDetails = await SolPriceManager.getInstance().getPrice()
		const balanceInUsd = balanceInSol * solPriceDetails.price

		return {
			balanceInSol,
			balanceInUsd,
			solPriceInUSD: solPriceDetails.price,
			solPriceRetrievedTime: solPriceDetails.fetchedAt
		}
	} catch (error) {
		console.error(error)
		throw error
	}
}

export async function getWalletBalanceSol(publicKey: PublicKey): Promise<number> {
	try {
		const connection = new Connection(clusterApiUrl("devnet"), "confirmed")

		const balanceInLamports = await connection.getBalance(publicKey)
		const balanceInSol = balanceInLamports / LAMPORTS_PER_SOL

		return balanceInSol
	} catch (error) {
		console.error(error)
		throw error
	}
}
