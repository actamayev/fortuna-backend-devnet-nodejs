import { Request, Response, NextFunction } from "express"
import doesUserHaveSolanaWallet from "../../utils/auth-helpers/does-x-exist/does-user-have-solana-wallet"

export default async function confirmUserDoesNotHaveSolanaWallet(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void | Response> {
	try {
		const user = req.user
		const doesUserHaveASolanaWallet = await doesUserHaveSolanaWallet(user.user_id)

		if (doesUserHaveASolanaWallet === true) return res.status(400).json({ message: "User already has a Solana wallet"})

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Check if User already has a solana wallet" })
	}
}
