import _ from "lodash"
import { Cluster, Connection, LAMPORTS_PER_SOL, clusterApiUrl } from "@solana/web3.js"

export default async function determineTransactionFee(
	signature: string,
	clusterType: Cluster,
	solPriceInUSD: number
): Promise<
	void | { feeInSol: number, usdPrice: number, solPriceInUSD: number }
> {
	try {
		const connection = new Connection(clusterApiUrl(clusterType), "confirmed")
		const transactionDetails = await connection.getTransaction(
			signature,
			{ commitment: "confirmed", maxSupportedTransactionVersion: 0 }
		)

		if (_.isNull(transactionDetails)) return
		const fee = transactionDetails.meta?.fee
		if (_.isUndefined(fee)) return
		const feeInSol = fee / LAMPORTS_PER_SOL

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
