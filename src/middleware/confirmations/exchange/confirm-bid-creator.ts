import { Request, Response, NextFunction } from "express"
import checkIfActiveBidByUserExists from "../../../db-operations/read/secondary-market/bid/check-if-active-bid-by-user-exists"

export default async function confirmBidCreator(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
	try {
		const { user } = req
		const { splBidId } = req.params
		const bidByUserExists = await checkIfActiveBidByUserExists(parseInt(splBidId, 10), user.user_id)

		if (bidByUserExists === false) {
			return res.status(400).json({ message: "Bid doesn't belong to the user making the request." })
		}
		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to confirm bid originator" })
	}
}
