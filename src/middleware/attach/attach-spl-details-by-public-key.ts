import _ from "lodash"
import { NextFunction, Request, Response } from "express"
import retrieveSplDetailsByPublicKey from "../../db-operations/read/spl/retrieve-spl-details-by-public-key"
import transformSplDetailsRetrievedByPublicKey from "../../utils/transform/transform-spl-details-retrieved-by-public-key"

export async function attachSplDetailsByPublicKeyForPrimarySplPurchase(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response | void> {
	try {
		const purchaseSplTokensData = req.body.purchaseSplTokensData as PurchasePrimarySPLTokensData
		const splDetails = await retrieveSplDetailsByPublicKey(purchaseSplTokensData.splPublicKey)

		if (_.isNull(splDetails)) return res.status(400).json({ message: "Unable to find Token Details" })
		const transformedSplDetails = transformSplDetailsRetrievedByPublicKey(splDetails)
		req.splDetails = transformedSplDetails
		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Attach Spl Details by Public Key (Primary)" })
	}
}

export async function attachSplDetailsByPublicKeyForSecondarySplBid(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response | void> {
	try {
		const createSplBid = req.body.createSplBid as CreateSplBidData
		const splDetails = await retrieveSplDetailsByPublicKey(createSplBid.splPublicKey)

		if (_.isNull(splDetails)) return res.status(400).json({ message: "Unable to find Token Details" })
		const transformedSplDetails = transformSplDetailsRetrievedByPublicKey(splDetails)
		req.splDetails = transformedSplDetails
		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Attach Spl Details by Public Key (Bid)" })
	}
}

export async function attachSplDetailsByPublicKeyForSecondarySplAsk(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response | void> {
	try {
		const createSplAsk = req.body.createSplAsk as CreateSplAskData
		const splDetails = await retrieveSplDetailsByPublicKey(createSplAsk.splPublicKey)

		if (_.isNull(splDetails)) return res.status(400).json({ message: "Unable to find Token Details" })
		const transformedSplDetails = transformSplDetailsRetrievedByPublicKey(splDetails)
		req.splDetails = transformedSplDetails
		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Attach Spl Details by Public Key (Ask)" })
	}
}
