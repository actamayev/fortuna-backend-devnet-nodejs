import PrismaClientClass from "../../../classes/prisma-client"

export default async function retrieveExclusiveAccessByWalletId(
	userId: number
): Promise<RetrievedMyExclusiveContentData[]> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()

		return await prismaClient.exclusive_video_access_purchase.findMany({
			where: {
				user_id: userId
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
