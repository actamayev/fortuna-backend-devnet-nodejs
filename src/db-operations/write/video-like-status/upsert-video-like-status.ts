import PrismaClientClass from "../../../classes/prisma-client"

export default async function upsertVideoLikeStatus(
	videoId: number,
	userId: number,
	likeStatus: boolean
): Promise<void> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()

		await prismaClient.video_like_status.upsert({
			where: {
				video_id_user_id: {
					video_id: videoId,
					user_id: userId
				}
			},
			update: {
				like_status: likeStatus,
				is_active: true
			},
			create: {
				video_id: videoId,
				user_id: userId,
				like_status: likeStatus
			}
		})
	} catch (error) {
		console.error(error)
		throw error
	}
}
