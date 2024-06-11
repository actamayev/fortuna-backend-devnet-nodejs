import { NextFunction, Request, Response } from "express"

export default function confirmEnoughPurchasesAvailable(req: Request, res: Response, next: NextFunction): Response | void {
	try {
		const { exclusiveVideoData } = req

		if (exclusiveVideoData.is_tier_sold_out === true) {
			return res.status(400).json({ message: "This tier is sold out" })
		}

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to confirm there are enough purchases available" })
	}
}
