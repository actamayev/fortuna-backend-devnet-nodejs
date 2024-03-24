import { Cluster, Connection, LAMPORTS_PER_SOL, PublicKey, clusterApiUrl } from "@solana/web3.js"

export default async function getWalletBalance(
	clusterType: Cluster,
	publicKeyString: string,
	solPriceInUSD: number
): Promise<
	void | { balanceInSol: number, balanceInUsd: number }
> {
	try {
		const connection = new Connection(clusterApiUrl(clusterType), "confirmed")

		const publicKey = new PublicKey(publicKeyString)
		const balanceInLamports = await connection.getBalance(publicKey)
		const balanceInSol = balanceInLamports / LAMPORTS_PER_SOL
		const balanceInUsd = balanceInSol * solPriceInUSD

		return {
			balanceInSol,
			balanceInUsd
		}
	} catch (error) {
		console.error(error)
	}
}
