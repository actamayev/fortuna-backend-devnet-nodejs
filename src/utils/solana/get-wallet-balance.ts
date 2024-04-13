import _ from "lodash"
import { Cluster, Connection, LAMPORTS_PER_SOL, PublicKey, clusterApiUrl } from "@solana/web3.js"
import SolPriceManager from "../../classes/sol-price-manager"

export default async function getWalletBalance(
	clusterType: Cluster,
	publicKeyString: string,
): Promise<{ balanceInSol: number, balanceInUsd: number } | void> {
	try {
		const connection = new Connection(clusterApiUrl(clusterType), "confirmed")

		const publicKey = new PublicKey(publicKeyString)
		const balanceInLamports = await connection.getBalance(publicKey)
		const balanceInSol = balanceInLamports / LAMPORTS_PER_SOL
		const solPriceInUSD = await SolPriceManager.getInstance().getPrice()
		if (_.isNull(solPriceInUSD)) throw Error("Unable to retrieve Sol price")
		const balanceInUsd = balanceInSol * solPriceInUSD

		return {
			balanceInSol,
			balanceInUsd
		}
	} catch (error) {
		console.error(error)
	}
}
