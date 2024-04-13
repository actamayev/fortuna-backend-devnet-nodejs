import { Cluster } from "@solana/web3.js"
import calculateTransactionFee from "./calculate-transaction-fee"

export default async function determineTransactionFee(
	signature: string,
	clusterType: Cluster,
	solPriceInUSD: number
): Promise<{ feeInSol: number, usdPrice: number, solPriceInUSD: number }> {
	try {
		const feeInSol = await calculateTransactionFee(signature, clusterType)
		const usdPrice = feeInSol * solPriceInUSD

		return {
			feeInSol,
			usdPrice,
			solPriceInUSD
		}
	} catch (error) {
		console.error(error)
		throw error
	}
}
