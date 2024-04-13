import _ from "lodash"
import { Connection, LAMPORTS_PER_SOL, clusterApiUrl } from "@solana/web3.js"

export default async function calculateTransactionFee(signature: string): Promise<number> {
	try {
		const connection = new Connection(clusterApiUrl("devnet"), "confirmed")
		const transactionDetails = await connection.getTransaction(
			signature,
			{ commitment: "confirmed", maxSupportedTransactionVersion: 0 }
		)

		if (_.isNull(transactionDetails) || _.isNull(transactionDetails.meta)) {
			console.error("Unable to retrieve transaction details")
			throw Error("Unable to retrieve transaction details")
		}

		const fee = transactionDetails.meta.fee
		const feeInSol = fee / LAMPORTS_PER_SOL

		return feeInSol
	} catch (error) {
		console.error(error)
		throw error
	}
}
