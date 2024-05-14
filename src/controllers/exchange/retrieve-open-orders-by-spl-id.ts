import { Request, Response } from "express"
import retrieveOpenAsksBySplId from "../../db-operations/read/secondary-market/ask/retrieve-open-asks-by-spl-id"
import retrieveOpenBidsBySplId from "../../db-operations/read/secondary-market/bid/retrieve-open-bids-by-spl-id"

export default async function retrieveOpenOrdersBySplId(req: Request, res: Response): Promise<Response> {
	try {
		const { splId } = req.params

		const asks = await retrieveOpenAsksBySplId(parseInt(splId, 10))
		const bids = await retrieveOpenBidsBySplId(parseInt(splId, 10))

		const openOrders = { asks, bids	}

		return res.status(200).json({ openOrders })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to retrieve user's orders" })
	}
}
