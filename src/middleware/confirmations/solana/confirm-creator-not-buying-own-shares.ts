import _ from "lodash"
import { Request, Response, NextFunction } from "express"

export default function confirmCreatorNotBuyingOwnShares(req: Request, res: Response, next: NextFunction): Response | void {
	try {
		const { solanaWallet, splDetails } = req

		if (_.isEqual(solanaWallet.solana_wallet_id, splDetails.creatorWalletId)) {
			return res.status(400).json({ message: "Attempting to purchase your own shares. Not currently available." })
		}
		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to confirm that creator isn't buying their own shares" })
	}
}
