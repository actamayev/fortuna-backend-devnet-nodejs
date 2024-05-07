import _ from "lodash"
import PrismaClientClass from "../../../classes/prisma-client"
import { validateExtendedSolanaWallet } from "../../../utils/types/type-guards"

export async function findSolanaWalletByUserId(userId: number): Promise<ExtendedSolanaWallet | null> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()
		const solanaWallet = await prismaClient.solana_wallet.findFirst({
			where: { user_id: userId }
		})
		if (_.isNull(solanaWallet) || validateExtendedSolanaWallet(solanaWallet) === false) return null
		return solanaWallet
	} catch (error) {
		console.error(`Error finding ${userId}'s Solana wallet:`, error)
		throw error
	}
}

export async function findSolanaWalletByPublicKey(publicKey: string): Promise<ExtendedSolanaWallet | null> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()
		const solanaWallet = await prismaClient.solana_wallet.findFirst({
			where: { public_key: publicKey }
		})
		if (_.isNull(solanaWallet) || validateExtendedSolanaWallet(solanaWallet) === false) return null

		return solanaWallet
	} catch (error) {
		console.error(`Error finding ${publicKey}'s Solana wallet:`, error)
		throw error
	}
}
