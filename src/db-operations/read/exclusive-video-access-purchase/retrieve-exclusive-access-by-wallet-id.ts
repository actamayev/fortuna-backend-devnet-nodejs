import PrismaClientClass from "../../../classes/prisma-client"

export default async function retrieveExclusiveAccessByWalletId(
	solanaWalletId: number
): Promise<RetrievedMyExclusiveContentData[]> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()

		return await prismaClient.exclusive_video_access_purchase.findMany({
			where: {
				solana_wallet_id: solanaWalletId,
			},
			select: {
				video: {
					select: {
						video_name: true,
						uuid: true,
						uploaded_image: {
							select: {
								image_url: true
							}
						}
					}
				}
			}
		})
	} catch (error) {
		console.error(error)
		throw error
	}
}
