import { Request, Response } from "express"
import retrieveUserAsks from "../../db-operations/read/secondary-market/ask/retrieve-user-asks"
import retrieveUserBids from "../../db-operations/read/secondary-market/bid/retrieve-user-bids"

export default async function retrieveUserOrders(req: Request, res: Response): Promise<Response> {
	try {
		const { user } = req

		const asks = await retrieveUserAsks(user.user_id)
		const bids = await retrieveUserBids(user.user_id)

		const combinedOrders = [...asks, ...bids]

		combinedOrders.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())

		return res.status(200).json({ combinedOrders })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to retrieve user's orders" })
	}
}
