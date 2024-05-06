import { solana_wallet } from "@prisma/client"
import prismaClient from "../../../../classes/prisma-client"

export async function findSolanaWalletByUserId(userId: number): Promise<solana_wallet | null> {
	try {
		const solanaWallet = await prismaClient.solana_wallet.findFirst({
			where: { user_id: userId }
		})
		return solanaWallet
	} catch (error) {
		console.error(`Error finding ${userId}'s Solana wallet:`, error)
		throw error
	}
}

export async function findSolanaWalletByPublicKey(publicKey: string): Promise<solana_wallet | null> {
	try {
		const solanaWallet = await prismaClient.solana_wallet.findFirst({
			where: { public_key: publicKey }
		})
		return solanaWallet
	} catch (error) {
		console.error(`Error finding ${publicKey}'s Solana wallet:`, error)
		throw error
	}
}
