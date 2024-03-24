import bs58 from "bs58"
import { Request, Response } from "express"
import { Keypair, Connection, clusterApiUrl } from "@solana/web3.js"
import prismaClient from "../../../prisma-client"

export default async function createDevnetSolanaWallet (req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user
		const wallet = Keypair.generate()
		const publicKey = wallet.publicKey.toBase58()
		const secretKey = bs58.encode(Buffer.from(wallet.secretKey))

		await prismaClient.solana_wallet.create({
			data: {
				public_key: publicKey,
				secret_key: secretKey,
				user_id: user.user_id,
				network_type: "devnet"
			}
		})

		const connection = new Connection(clusterApiUrl("devnet"), "confirmed")
		const balance = await connection.getBalance(wallet.publicKey)

		return res.status(200).json({ publicKey, balance })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Create Devnet Solana Wallet" })
	}
}
