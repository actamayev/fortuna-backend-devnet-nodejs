import _ from "lodash"
import { Request, Response, NextFunction } from "express"
import { findSolanaWalletByUserId } from "../../utils/find/find-solana-wallet"

export default async function confirmUserHasDevnetSolanaWallet(req: Request, res: Response,	next: NextFunction): Promise<void | Response> {
	try {
		const user = req.user
		const solanaWallet = await findSolanaWalletByUserId(user.user_id, "DEVNET")

		if (solanaWallet === undefined) throw Error("Error finding Devnet Solana Wallet")

		if (_.isNull(solanaWallet)) return res.status(400).json({ message: "User does not have a Devnet Solana wallet"})

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Check if User has a Devnet Solana wallet" })
	}
}
