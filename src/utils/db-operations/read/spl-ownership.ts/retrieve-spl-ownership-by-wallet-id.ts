import prismaClient from "../../../../prisma-client"

export default async function getSplOwnershipsByWalletId(
	parentSolanaWalletId: number
): Promise<RetrievedMyOwnershipData[]> {
	try {
		// TODO ASAP: Need to distinguish between spl's that I have created and ones i have bought.
		const splOwnerships = await prismaClient.spl_ownership.findMany({
			where: {
				token_account: {
					parent_solana_wallet_id: parentSolanaWalletId
				}
			},
			select: {
				spl: {
					select: {
						public_key_address: true
					}
				},
				number_of_shares: true
			}
		})

		const transformedSplOwnerships = splOwnerships.map((item): RetrievedMyOwnershipData => ({
			spl_public_key: item.spl.public_key_address,
			number_of_shares: item.number_of_shares
		}))


		return transformedSplOwnerships
	} catch (error) {
		console.error(error)
		throw error
	}
}
