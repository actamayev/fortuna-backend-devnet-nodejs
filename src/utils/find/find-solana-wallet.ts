import { SolanaWallet } from "@prisma/client"
import prismaClient from "../../prisma-client"

export default async function findSolanaWallet(userId: number): Promise<SolanaWallet | null> {
	try {
		const solanaWallet = await prismaClient.solanaWallet.findUnique({
			where: { userId },
		})
		return solanaWallet
	} catch (error) {
		console.error("Error finding solana wallet:", error)
		return null
	}
}
