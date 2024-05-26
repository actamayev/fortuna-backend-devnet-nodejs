import { Request, Response, NextFunction } from "express"
import checkIfUserMadeExclusiveSplPurchase
	from "../../../../db-operations/read/exclusive-spl-purchase/check-if-user-made-exclusive-spl-purchase"

export default async function confirmUserDoesntAlreadyHaveExclusiveAccess(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response | void> {
	try {
		const { solanaWallet, exclusiveVideoData } = req
		const doesUserAlreadyHaveExclusiveAccess = await checkIfUserMadeExclusiveSplPurchase(
			solanaWallet.solana_wallet_id, exclusiveVideoData.spl_id
		)

		if (doesUserAlreadyHaveExclusiveAccess === true) {
			return res.status(400).json({
				message: "Unable to purchase instant access to exclusive content. User already has exclusive access"
			})
		}
		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Check if user already has exclusive content access" })
	}
}
