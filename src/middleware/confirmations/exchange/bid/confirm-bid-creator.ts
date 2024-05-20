import _ from "lodash"
import { Request, Response, NextFunction } from "express"
import checkIfActiveBidByIdExists from "../../../../db-operations/read/secondary-market/bid/check-if-active-bid-by-id-exists"

export default async function confirmBidCreator(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
	try {
		const { user } = req
		const { splBidId } = req.params
		const bidData = await checkIfActiveBidByIdExists(parseInt(splBidId, 10))

		if (_.isNull(bidData)) return res.status(400).json({ message: "Bid doesn't exist" })

		if (!_.isEqual(bidData.solana_wallet_id, user.user_id)) {
			return res.status(400).json({ message: "Bid doesn't belong to the user making the request." })
		}
		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to confirm bid originator" })
	}
}
