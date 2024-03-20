import { SolanaWallet, NetworkType } from "@prisma/client"
import prismaClient from "../../prisma-client"

export default async function findSolanaWallet(
	userId: number,
	networkType: NetworkType
): Promise<SolanaWallet | null | void> {
	try {
		const solanaWallet = await prismaClient.solanaWallet.findFirst({
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
