import { Request, Response, NextFunction } from "express"
import checkIfUserAllowedToAccessContent from "../../../../utils/exclusive-content/check-if-user-allowed-to-access-content"

export default async function confirmUserDoesntAlreadyHaveExclusiveAccess(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response | void> {
	try {
		const { solanaWallet, exclusiveVideoData } = req
		const doesUserAlreadyHaveExclusiveAccess = await checkIfUserAllowedToAccessContent(
			solanaWallet.solana_wallet_id, exclusiveVideoData
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
