import { Request, Response } from "express"
import addSecondaryMarketAsk from "../../db-operations/write/secondary-market/add-secondary-market-ask"

// eslint-disable-next-line max-len
// TODO: To make sure that the user has enough funds to make a bid, will need to have a hook in the front-end that runs anytime there is a change in wallet balance
export default async function placeSecondaryMarketSplAsk(req: Request, res: Response): Promise<Response> {
	try {
		const { splDetails , solanaWallet} = req
		const createSplAskData = req.body.createSplAsk as CreateSplAskData

		await addSecondaryMarketAsk(splDetails.splId, solanaWallet.solana_wallet_id, createSplAskData)
		// TODO: check if there are bids that are at or above the ask price.
		// If there are, find the closest one, and complete the trade at the average price
		return res.status(200).json({ success: "" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to create Spl Ask" })
	}
}
