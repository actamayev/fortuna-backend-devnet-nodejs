import prismaClient from "../../../../prisma-client"

export default async function getSplOwnershipsByWalletId(
	parentSolanaWalletId: number
): Promise<RetrievedMyOwnershipData[]> {
	try {
		// ASAP: Need to distinguish between spl's that I have created and ones i have bought.
		const splOwnerships = await prismaClient.spl_ownership.findMany({
			where: {
				token_account: {
					parent_solana_wallet_id: parentSolanaWalletId
				}
			},
			select: {
				spl_id: true,
				number_of_shares: true
			}
		})

		return splOwnerships
	} catch (error) {
		console.error(error)
		throw error
	}
}
