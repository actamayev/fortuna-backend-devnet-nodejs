import { SolanaWallet, NetworkType } from "@prisma/client"
import prismaClient from "../../prisma-client"

export default async function findSolanaWallet(userId: number, networkType: NetworkType): Promise<SolanaWallet | null> {
	try {
		const solanaWallet = await prismaClient.solanaWallet.findFirst({
			where: {
				userId,
				networkType
			},
		})
		return solanaWallet
	} catch (error) {
		console.error("Error finding solana wallet:", error)
		return null
	}
}
