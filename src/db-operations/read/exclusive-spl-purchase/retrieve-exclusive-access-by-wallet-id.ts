import PrismaClientClass from "../../../classes/prisma-client"

export default async function retrieveExclusiveAccessByWalletId(
	solanaWalletId: number
): Promise<RetrievedMyExclusiveContentData[]> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()
		const exclusiveContentOwnership = await prismaClient.exclusive_spl_purchase.findMany({
			where: {
				solana_wallet_id: solanaWalletId,
			},
			select: {
				spl: {
					select: {
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

		return exclusiveContentOwnership
	} catch (error) {
		console.error(error)
		throw error
	}
}
