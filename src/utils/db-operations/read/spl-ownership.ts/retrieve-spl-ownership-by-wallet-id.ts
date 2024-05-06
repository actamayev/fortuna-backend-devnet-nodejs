import prismaClient from "../../../../classes/prisma-client"

export default async function getSplOwnershipsByWalletId(
	parentSolanaWalletId: number
): Promise<RetrievedMyOwnershipData[]> {
	try {
		const splOwnerships = await prismaClient.spl_ownership.findMany({
			where: {
				token_account: {
					parent_solana_wallet_id: parentSolanaWalletId
				}
			},
			select: {
				number_of_shares: true,
				spl: {
					select: {
						creator_wallet_id: true,
						public_key_address: true,
						spl_name: true,
						uploaded_image: {
							select: {
								image_url: true,
								uuid: true
							}
						}
					}
				}
			}
		})

		return splOwnerships
	} catch (error) {
		console.error(error)
		throw error
	}
}
