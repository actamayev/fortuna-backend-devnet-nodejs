import { Request, Response, NextFunction } from "express"
import { Connection, LAMPORTS_PER_SOL, PublicKey, clusterApiUrl } from "@solana/web3.js"

export default async function confirmUserHasEnoughSolToTransfer(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void | Response> {
	try {
		const solanaWallet = req.solanaWallet
		const transferData = req.body.transferSolData as TransferSolData
		const isRecipientFortunaWallet = req.isRecipientFortunaWallet

		const connection = new Connection(clusterApiUrl("devnet"), "confirmed")
		const publicKey = new PublicKey(solanaWallet.public_key)

		const balanceInLamports = await connection.getBalance(publicKey)
		const balanceInSol = balanceInLamports / LAMPORTS_PER_SOL
		if (isRecipientFortunaWallet === true) {
			if (balanceInSol < transferData.transferAmountSol) {
				return res.status(400).json({ message: "User does not have enough sol to complete the transfer" })
			}
		} else {
			// This is if the recipient is not registered with Fortuna. In this case, the sender must cover the transaction fee.
			const transferCostSol = 5000 / LAMPORTS_PER_SOL
			if (balanceInSol < (transferData.transferAmountSol + transferCostSol)) {
				return res.status(400).json({ message: "User does not have enough sol to complete the transfer" })
			}
		}

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Check if User has enough Sol to complete the transfer" })
	}
}
