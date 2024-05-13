import { Request, Response } from "express"
import cancelSecondaryMarketAsk from "../../../db-operations/write/secondary-market/ask/cancel-secondary-market-ask"

export default async function cancelSplAsk(req: Request, res: Response): Promise<Response> {
	try {
		const { splAskId } = req.params

		await cancelSecondaryMarketAsk(parseInt(splAskId, 10))

		return res.status(200).json({ })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to cancel Ask"})
	}
}
