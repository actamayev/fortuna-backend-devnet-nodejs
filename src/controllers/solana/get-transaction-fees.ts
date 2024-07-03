import { Request, Response } from "express"
import SolPriceManager from "../../classes/solana/sol-price-manager"
import determineTransactionFee from "../../utils/solana/determine-transaction-fee"

export default async function getTransactionFees(req: Request, res: Response): Promise<Response> {
	try {
		const transactionSignatures = req.body as string[]

		const solPriceDetails = await SolPriceManager.getInstance().getPrice()

		const transactionFees = await Promise.all(transactionSignatures.map(async (signature) => {
			const result = await determineTransactionFee(signature, solPriceDetails.price)
			return {
				signature,
				...result
			}
		}))

		return res.status(200).json({ transactionFees })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Get Transaction Fee" })
	}
}
