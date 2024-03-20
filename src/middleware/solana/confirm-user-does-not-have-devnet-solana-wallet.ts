import _ from "lodash"
import { Request, Response, NextFunction } from "express"
import findSolanaWallet from "../../utils/find/find-solana-wallet"

export default async function confirmUserDoesNotHaveDevnetSolanaWallet(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void | Response> {
	try {
		const user = req.user
		const solanaWallet = await findSolanaWallet(user.user_id, "DEVNET")

		if (solanaWallet === undefined) throw Error("Error finding Devnet Solana Wallet")

		if (!_.isNull(solanaWallet)) return res.status(400).json({ message: "User already has a Devnet Solana wallet"})

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Check if User already has a Devnet Solana wallet" })
	}
}
