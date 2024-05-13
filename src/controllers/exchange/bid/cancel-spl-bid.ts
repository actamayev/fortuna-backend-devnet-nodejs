import { Request, Response } from "express"
import cancelSecondaryMarketBid from "../../../db-operations/write/secondary-market/bid/cancel-secondary-market-bid"

export default async function cancelSplBid(req: Request, res: Response): Promise<Response> {
	try {
		const { splBidId } = req.params

		await cancelSecondaryMarketBid(parseInt(splBidId, 10))

		return res.status(200).json({ })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to cancel Bid"})
	}
}
