import _ from "lodash"
import { Cluster, Connection, LAMPORTS_PER_SOL, clusterApiUrl } from "@solana/web3.js"

export default async function calculateTransactionFee(signature: string, clusterType: Cluster): Promise<number | void> {
	try {
		const connection = new Connection(clusterApiUrl(clusterType), "confirmed")
		const transactionDetails = await connection.getTransaction(
			signature,
			{ commitment: "confirmed", maxSupportedTransactionVersion: 0 }
		)

		if (_.isNull(transactionDetails) || _.isNull(transactionDetails.meta)) return

		const fee = transactionDetails.meta.fee
		const feeInSol = fee / LAMPORTS_PER_SOL

		return feeInSol
	} catch (error) {
		console.error(error)
	}
}
