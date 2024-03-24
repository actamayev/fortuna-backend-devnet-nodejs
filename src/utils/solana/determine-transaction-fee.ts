import { Cluster } from "@solana/web3.js"
import calculateTransactionFee from "./calculate-transaction-fee"

export default async function determineTransactionFee(
	signature: string,
	clusterType: Cluster,
	solPriceInUSD: number
): Promise<
	void | { feeInSol: number, usdPrice: number, solPriceInUSD: number }
> {
	try {
		const feeInSol = await calculateTransactionFee(signature, clusterType)
		if (feeInSol === undefined) return
		const usdPrice = feeInSol * solPriceInUSD

		return {
			feeInSol,
			usdPrice,
			solPriceInUSD
		}
	} catch (error) {
		console.error(error)
	}
}
