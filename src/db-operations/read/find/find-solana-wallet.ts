import _ from "lodash"
import { PublicKey } from "@solana/web3.js"
import PrismaClientClass from "../../../classes/prisma-client"
import { validateExtendedSolanaWallet } from "../../../utils/types/type-guards"

export async function findSolanaWalletByUserId(userId: number): Promise<ExtendedSolanaWallet | null> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()

		const solanaWallet = await prismaClient.solana_wallet.findUnique({
			where: {
				user_id: userId
			}
		})

		if (_.isNull(solanaWallet) || validateExtendedSolanaWallet(solanaWallet) === false) return null

		return solanaWallet
	} catch (error) {
		console.error(`Error finding ${userId}'s Solana wallet:`, error)
		throw error
	}
}

export async function findSolanaWalletByPublicKey(publicKey: PublicKey): Promise<ExtendedSolanaWallet | null> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()

		const solanaWallet = await prismaClient.solana_wallet.findFirst({
			where: {
				public_key: publicKey.toString()
			}
		})

		if (_.isNull(solanaWallet) || validateExtendedSolanaWallet(solanaWallet) === false) return null

		return solanaWallet
	} catch (error) {
		console.error(`Error finding ${publicKey.toString()}'s Solana wallet:`, error)
		throw error
	}
}
