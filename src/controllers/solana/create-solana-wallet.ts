import bs58 from "bs58"
import { Keypair } from "@solana/web3.js"
import { Request, Response } from "express"
import prismaClient from "../../prisma-client"

export default async function createSolanaWallet (req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user
		const wallet = Keypair.generate()
		const publicKey = wallet.publicKey.toBase58()
		const secretKey = bs58.encode(Buffer.from(wallet.secretKey))

		await prismaClient.solanaWallet.create({
			data: {
				publicKey,
				secretKey,
				userId: user.user_id
			}
		})
		return res.status(200).json({ publicKey: wallet.publicKey.toBase58() })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Create Solana Wallet" })
	}
}
