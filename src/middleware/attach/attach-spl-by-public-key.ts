import _ from "lodash"
import { NextFunction, Request, Response } from "express"
import retrieveSplByPublicKey from "../../utils/db-operations/read/spl/retrieve-spl-by-public-key"

export default async function attachSplByPublicKey(req: Request, res: Response, next: NextFunction) : Promise<void | Response> {
	try {
		const purchaseSplTokensData = req.body.purchaseSplTokensData as PurchaseSPLTokensData
		const splDetails = await retrieveSplByPublicKey(purchaseSplTokensData.splPublicKey)

		if (_.isNull(splDetails)) return res.status(400).json({ message: "Unable to find Token Details" })
		req.splDetails = splDetails
		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Attach Solana Wallet" })
	}
}
