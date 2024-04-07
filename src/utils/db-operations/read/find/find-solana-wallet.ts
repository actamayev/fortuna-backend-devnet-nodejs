import { solana_wallet, network_type } from "@prisma/client"
import prismaClient from "../../../../prisma-client"

export async function findSolanaWalletByUserId(
	userId: number,
	networkType: network_type
): Promise<solana_wallet | null | void> {
	try {
		const solanaWallet = await prismaClient.solana_wallet.findFirst({
			where: {
				user_id: userId,
				network_type: networkType
			},
		})
		return solanaWallet
	} catch (error) {
		console.error(`Error finding ${networkType} Solana wallet:`, error)
	}
}

export async function findSolanaWalletByPublicKey(
	publicKey: string,
	networkType: network_type
): Promise<solana_wallet | null | void> {
	try {
		const solanaWallet = await prismaClient.solana_wallet.findFirst({
			where: {
				public_key: publicKey,
				network_type: networkType
			},
		})
		return solanaWallet
	} catch (error) {
		console.error(`Error finding ${networkType} Solana wallet:`, error)
	}
}
