import _ from "lodash"
import { NextFunction, Request, Response } from "express"
import retrieveSplDetailsByPublicKey from "../../utils/db-operations/read/spl/retrieve-spl-details-by-public-key"
import transformSplDetailsRetrievedByPublicKey from "../../utils/solana/transform/transform-spl-details-retrieved-by-public-key"

export default async function attachSplDetailsByPublicKey(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
	try {
		const purchaseSplTokensData = req.body.purchaseSplTokensData as PurchaseSPLTokensData
		const splDetails = await retrieveSplDetailsByPublicKey(purchaseSplTokensData.splPublicKey)

		if (_.isNull(splDetails)) return res.status(400).json({ message: "Unable to find Token Details" })
		const transformedSplDetails = transformSplDetailsRetrievedByPublicKey(splDetails)
		req.splDetails = transformedSplDetails
		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Attach Spl Details by Public Key" })
	}
}
