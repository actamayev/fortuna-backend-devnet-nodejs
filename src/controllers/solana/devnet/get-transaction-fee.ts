import _ from "lodash"
import { Request, Response } from "express"
import getSolPriceInUSD from "../../../utils/solana/get-sol-price-in-usd"
import determineTransactionFee from "../../../utils/solana/determine-transaction-fee"

export default async function getTransactionFee(req: Request, res: Response): Promise<Response> {
	try {
		const transactionData = req.body.transactionData

		const solPriceInUSD = await getSolPriceInUSD()
		if (_.isNull(solPriceInUSD)) return res.status(400).json({ message: "Unable to retrieve Sol Price in USD" })

		const transactionFeeResult = await determineTransactionFee(transactionData.signature, "devnet", solPriceInUSD)

		if (transactionFeeResult === undefined) return res.status(400).json({ message: "Unable to determine Transaction Fee"})

		return res.status(200).json({ ...transactionFeeResult })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Get Transaction Fee" })
	}
}
