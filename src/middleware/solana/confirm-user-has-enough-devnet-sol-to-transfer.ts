import { Request, Response, NextFunction } from "express"
import { Connection, LAMPORTS_PER_SOL, PublicKey, clusterApiUrl } from "@solana/web3.js"

export default async function confirmUserHasEnoughDevnetSolToTransfer(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void | Response> {
	try {
		const transferData = req.body.transferData
		const solanaWallet = req.solanaWallet

		const connection = new Connection(clusterApiUrl("devnet"), "confirmed")

		const publicKey = new PublicKey(solanaWallet.public_key)

		const balanceInLamports = await connection.getBalance(publicKey)
		const balanceInSol = balanceInLamports / LAMPORTS_PER_SOL

		if (balanceInSol < transferData.transferAmountSol) {
			return res.status(400).json({ message: "User does not have enough sol" })
		}

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Check if User already has a Devnet Solana wallet" })
	}
}
