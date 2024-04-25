import { Request, Response } from "express"
import SolPriceManager from "../../classes/sol-price-manager"

export default async function getSolPrice(req: Request, res: Response): Promise<Response> {
	try {
		const solPriceDetails = await SolPriceManager.getInstance().getPrice()

		return res.status(200).json({
			solPriceInUSD: solPriceDetails.price,
			lastRetrievedTime: solPriceDetails.fetchedAt
		})
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Retrieve Solana price" })
	}
}
