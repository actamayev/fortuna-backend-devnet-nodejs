import PrismaClientClass from "../../../classes/prisma-client"

export default async function retrieveNonExclusiveVideoByUUID(
	videoId: number,
	userId: number
): Promise<NonExclusiveVideoData | null> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()

		return await prismaClient.video.findFirst({
			where: {
				video_id: videoId,
				creator_user_id: userId,
				is_video_exclusive: {
					not: true
				},
				video_creator: {
					is_active: true
				}
			},
			select: {
				video_id: true,
				video_listing_status: true
			}
		})
	} catch (error) {
		console.error(error)
		throw error
	}
}
