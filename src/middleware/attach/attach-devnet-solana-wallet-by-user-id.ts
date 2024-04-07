import _ from "lodash"
import { NextFunction, Request, Response } from "express"
import { findSolanaWalletByUserId } from "../../utils/db-operations/read/find/find-solana-wallet"

export default async function attachDevnetSolanaWalletByUserId(req: Request, res: Response, next: NextFunction) : Promise<void | Response> {
	try {
		const user = req.user
		const solanaWallet = await findSolanaWalletByUserId(user.user_id, "devnet")
		if (_.isNull(solanaWallet) || solanaWallet === undefined) {
			return res.status(400).json({ message: "Cannot find Devnet Solana Wallet" })
		}

		req.solanaWallet = solanaWallet
		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Attach Devnet Solana Wallet" })
	}
}
