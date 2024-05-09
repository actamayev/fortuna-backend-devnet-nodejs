import { Request, Response } from "express"
import addSecondaryMarketBid from "../../db-operations/write/secondary-market/add-secondary-market-bid"

// eslint-disable-next-line max-len
// TODO: To make sure that the user has enough funds to make a bid, will need to have a hook in the front-end that runs anytime there is a change in wallet balance
export default async function placeSecondaryMarketSplBid(req: Request, res: Response): Promise<Response> {
	try {
		const { splDetails , solanaWallet} = req
		const createSplBidData = req.body.createSplBid as CreateSplBidData

		await addSecondaryMarketBid(splDetails.splId, solanaWallet.solana_wallet_id, createSplBidData)

		// TODO: check if there are asks that are at or below the bid price.
		// If there are, find the closest one, and complete the trade at the average price
		return res.status(200).json({ success: "" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to create Spl Bid" })
	}
}
