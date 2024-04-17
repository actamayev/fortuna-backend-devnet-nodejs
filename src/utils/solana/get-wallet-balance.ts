import { Connection, LAMPORTS_PER_SOL, PublicKey, clusterApiUrl } from "@solana/web3.js"
import SolPriceManager from "../../classes/sol-price-manager"

export async function getWalletBalanceWithUSD(
	publicKeyString: string,
): Promise<{ balanceInSol: number, balanceInUsd: number }> {
	try {
		const balanceInSol = await getWalletBalanceSol(publicKeyString)
		const solPriceDetails = await SolPriceManager.getInstance().getPrice()
		const balanceInUsd = balanceInSol * solPriceDetails.price

		return {
			balanceInSol,
			balanceInUsd
		}
	} catch (error) {
		console.error(error)
		throw error
	}
}

export async function getWalletBalanceSol(publicKeyString: string): Promise<number> {
	try {
		const connection = new Connection(clusterApiUrl("devnet"), "confirmed")

		const publicKey = new PublicKey(publicKeyString)
		const balanceInLamports = await connection.getBalance(publicKey)
		const balanceInSol = balanceInLamports / LAMPORTS_PER_SOL

		return balanceInSol
	} catch (error) {
		console.error(error)
		throw error
	}
}
