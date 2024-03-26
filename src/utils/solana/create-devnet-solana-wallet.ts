import bs58 from "bs58"
import { Keypair, Connection, clusterApiUrl } from "@solana/web3.js"
import prismaClient from "../../prisma-client"

export default async function createDevnetSolanaWallet(userId: number): Promise<
	{ publicKey: string, balance: number} | void
> {
	try {
		const wallet = Keypair.generate()
		const publicKey = wallet.publicKey.toBase58()
		const secretKey = bs58.encode(Buffer.from(wallet.secretKey))

		await prismaClient.solana_wallet.create({
			data: {
				public_key: publicKey,
				secret_key: secretKey,
				user_id: userId,
				network_type: "devnet"
			}
		})

		const connection = new Connection(clusterApiUrl("devnet"), "confirmed")
		const balance = await connection.getBalance(wallet.publicKey)

		return { publicKey, balance }
	} catch (error) {
		console.error(error)
	}
}
