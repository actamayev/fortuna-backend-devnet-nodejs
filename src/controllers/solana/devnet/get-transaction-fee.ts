import _ from "lodash"
import { Request, Response } from "express"
import { Connection, LAMPORTS_PER_SOL, clusterApiUrl } from "@solana/web3.js"
import getSolPriceInUSD from "../../../utils/solana/get-sol-price-in-usd"

export default async function getTransactionFee(req: Request, res: Response): Promise<Response> {
	try {
		const transactionData = req.body.transactionData
		const connection = new Connection(clusterApiUrl("devnet"), "confirmed")
		const transactionDetails = await connection.getTransaction(
			transactionData.signature,
			{ commitment: "confirmed", maxSupportedTransactionVersion: 0 }
		)

		if (_.isNull(transactionDetails)) return res.status(400).json({ message: "Unable to retrieve fee amount"})
		const fee = transactionDetails.meta?.fee
		if (_.isUndefined(fee)) return res.status(400).json({ message: "Unable to find fee"})
		const feeInSol = fee / LAMPORTS_PER_SOL

		const solPriceInUSD = await getSolPriceInUSD()
		if (_.isNull(solPriceInUSD)) return res.status(400).json({ message: "Unable to retrieve Sol in USD"})
		const usdPrice = feeInSol * solPriceInUSD
		return res.status(200).json({ feeInSol, usdPrice, solPriceInUSD })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Get Transaction Fee" })
	}
}

