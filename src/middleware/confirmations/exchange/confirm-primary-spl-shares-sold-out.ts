import { NextFunction, Request, Response } from "express"

export default function confirmPrimarySplSharesSoldOut(req: Request, res: Response, next: NextFunction): Response | void {
	try {
		const { splDetails } = req

		if (splDetails.splListingStatus !== "SOLDOUT") {
			return res.status(400).json({ message: "Unable to create secondary bid/ask. Primary shares not sold out yet" })
		}

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to confirm primary Spl shares are sold out" })
	}
}
