import bs58 from "bs58"
import { Keypair } from "@solana/web3.js"
import { solana_wallet } from "@prisma/client"
import prismaClient from "../../../../prisma-client"

export default async function addSolanaWalletRecord(keypair: Keypair, userId: number): Promise<solana_wallet> {
	try {
		const solanaWallet = await prismaClient.solana_wallet.create({
			data: {
				public_key: keypair.publicKey.toBase58(),
				secret_key: bs58.encode(Buffer.from(keypair.secretKey)),
				user_id: userId,
				network_type: "devnet"
			}
		})

		return solanaWallet
	} catch (error) {
		console.error("Error adding Solana Wallet record:", error)
		throw error
	}
}
