import _ from "lodash"
import { NextFunction, Request, Response } from "express"
import { findSolanaWalletByUserId } from "../../db-operations/read/find/find-solana-wallet"

export default async function attachSolanaWalletByUserId(req: Request, res: Response, next: NextFunction) : Promise<Response | void> {
	try {
		const { user } = req
		const solanaWallet = await findSolanaWalletByUserId(user.user_id)
		if (_.isNull(solanaWallet)) return res.status(400).json({ message: "Cannot find Solana Wallet" })

		req.solanaWallet = solanaWallet
		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Attach Solana Wallet by UserId" })
	}
}
