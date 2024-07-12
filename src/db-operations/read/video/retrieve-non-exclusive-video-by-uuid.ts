import PrismaClientClass from "../../../classes/prisma-client"

export default async function retrieveNonExclusiveVideoByUUID(
	videoUUID: string,
	userId: number
): Promise<NonExclusiveVideoData | null> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()

		return await prismaClient.video.findFirst({
			where: {
				uuid: videoUUID,
				creator_user_id: userId,
				is_video_exclusive: {
					not: true
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
