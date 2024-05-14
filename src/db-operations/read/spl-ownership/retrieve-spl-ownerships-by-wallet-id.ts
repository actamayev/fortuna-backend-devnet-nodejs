import PrismaClientClass from "../../../classes/prisma-client"

export default async function getSplOwnershipsByWalletId(
	solanaWalletId: number
): Promise<RetrievedMyOwnershipData[]> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()
		const splOwnerships = await prismaClient.spl_ownership.findMany({
			where: {
				solana_wallet_id: solanaWalletId,
				number_of_shares: {
					gt: 0
				}
			},
			select: {
				number_of_shares: true,
				purchase_price_per_share_usd: true,
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
