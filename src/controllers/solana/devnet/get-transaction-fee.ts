import { Request, Response } from "express"
import determineTransactionFee from "../../../utils/solana/determine-transaction-fee"

export default async function getTransactionFee(req: Request, res: Response): Promise<Response> {
	try {
		const transactionData = req.body.transactionData
		const transactionFeeResult = await determineTransactionFee(transactionData.signature, "devnet")

		if (transactionFeeResult === undefined) return res.status(400).json({ message: "Unable to determine Transaction Fee"})

		return res.status(200).json({ ...transactionFeeResult })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Get Transaction Fee" })
	}
}
