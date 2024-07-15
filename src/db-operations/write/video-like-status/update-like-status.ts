import PrismaClientClass from "../../../classes/prisma-client"

// eslint-disable-next-line max-lines-per-function
export default async function updateLikeStatus(
	videoId: number,
	userId: number,
	newLikeStatus: boolean
): Promise<void> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()

		if (newLikeStatus === false) {
			await prismaClient.video_like_status.update({
				where: {
					video_id_user_id: {
						video_id: videoId,
						user_id: userId
					}
				},
				data: {
					is_active: false
				}
			})
		} else {
			await prismaClient.video_like_status.upsert({
				where: {
					video_id_user_id: {
						video_id: videoId,
						user_id: userId
					}
				},
				update: {
					is_active: true
				},
				create: {
					video_id: videoId,
					user_id: userId
				}
			})
		}
	} catch (error) {
		console.error(error)
		throw error
	}
}
