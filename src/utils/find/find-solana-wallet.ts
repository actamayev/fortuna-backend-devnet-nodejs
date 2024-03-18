import { SolanaWallet, NetworkType } from "@prisma/client"
import prismaClient from "../../prisma-client"

export default async function findSolanaWallet(
	userId: number,
	networkType: NetworkType
): Promise<SolanaWallet | null | undefined> {
	try {
		const solanaWallet = await prismaClient.solanaWallet.findFirst({
			where: {
				userId,
				networkType
			},
		})
		return solanaWallet
	} catch (error) {
		console.error(`Error finding ${networkType} Solana wallet:`, error)
		return undefined
	}
}
