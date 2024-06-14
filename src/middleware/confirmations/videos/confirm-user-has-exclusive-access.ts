import { Request, Response, NextFunction } from "express"
import checkIfUserAllowedToAccessContent from "../../../utils/exclusive-content/check-if-user-allowed-to-access-content"

export default async function confirmUserHasExclusiveAccess(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
	try {
		const { solanaWallet, minimalDataNeededToCheckForExclusiveContentAccess } = req
		const doesUserHaveExclusiveAccess = await checkIfUserAllowedToAccessContent(
			minimalDataNeededToCheckForExclusiveContentAccess, solanaWallet.solana_wallet_id
		)

		if (doesUserHaveExclusiveAccess === false) {
			return res.status(400).json({ message: "User does not have exclusive access" })
		}
		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Check if user has exclusive content access" })
	}
}
