import { Keypair } from "@solana/web3.js"
import { Request, Response } from "express"

export default function createSolanaWallet (req: Request, res: Response): Response {
	try {
		const wallet = Keypair.generate()

		return res.status(200).json({
			publicKey: wallet.publicKey.toBase58(),
			secretKey: [...wallet.secretKey]
		})
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Logout" })
	}
}
