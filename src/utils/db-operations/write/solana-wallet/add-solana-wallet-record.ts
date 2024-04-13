import { solana_wallet } from "@prisma/client"
import prismaClient from "../../../../prisma-client"

export default async function addSolanaWalletRecord(newSolanaWalletFields: NewSolanaWalletFields): Promise<solana_wallet> {
	try {
		const solanaWallet = await prismaClient.solana_wallet.create({
			data: {
				public_key: newSolanaWalletFields.public_key,
				secret_key: newSolanaWalletFields.secret_key,
				user_id: newSolanaWalletFields.user_id,
				network_type: "devnet"
			}
		})

		return solanaWallet
	} catch (error) {
		console.error("Error adding Solana Wallet record:", error)
		throw error
	}
}
