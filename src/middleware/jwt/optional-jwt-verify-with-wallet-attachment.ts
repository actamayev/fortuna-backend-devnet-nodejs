import _ from "lodash"
import { Request, Response, NextFunction } from "express"
import getDecodedId from "../../utils/auth-helpers/get-decoded-id"
import { findSolanaWalletByUserId } from "../../db-operations/read/find/find-solana-wallet"

export default async function optionalJwtVerifyWithWalletAttachment(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response | void> {
	try {
		const accessToken = req.headers.authorization as string | undefined

		if (_.isUndefined(accessToken)) {
			next()
			return
		}

		const userId = await getDecodedId(accessToken)

		const solanaWallet = await findSolanaWalletByUserId(userId)
		if (_.isNull(solanaWallet)) return res.status(400).json({ message: "Cannot find Solana Wallet" })

		req.solanaWallet = solanaWallet
		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Unable to verify user" })
	}
}
