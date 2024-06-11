import _ from "lodash"
import { Request, Response, NextFunction } from "express"

export default function confirmCreatorNotBuyingInstantAccessToOwnExclusiveContent(
	req: Request,
	res: Response,
	next: NextFunction
): Response | void {
	try {
		const { solanaWallet, exclusiveVideoData } = req

		if (_.isEqual(solanaWallet.solana_wallet_id, exclusiveVideoData.creator_wallet_id)) {
			return res.status(400).json({ message: "Attempting to purchase instant access to own exclusive content." })
		}
		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({
			error: "Internal Server Error: Unable to confirm that creator isn't purchasing instant access to own content"
		})
	}
}
