import PrismaClientClass from "../../../classes/prisma-client"

export async function retrieveVideoDataForExclusiveContentCheckByUUID(
	videoUUID: string
): Promise<VideoDataNeededToCheckForExclusiveContentAccess | null> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()

		return await prismaClient.video.findFirst({
			where: {
				uuid: videoUUID,
				video_listing_status: {
					not: "UNLISTED"
				},
				video_creator: {
					is_active: true
				}
			},
			select: {
				video_id: true,
				creator_user_id: true,
				is_video_exclusive: true
			}
		})
	} catch (error) {
		console.error(error)
		throw error
	}
}

export async function retrieveVideoDataForExclusiveContentCheckById(
	videoId: number
): Promise<VideoDataNeededToCheckForExclusiveContentAccess | null> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()

		return await prismaClient.video.findFirst({
			where: {
				video_id: videoId,
				video_listing_status: {
					not: "UNLISTED"
				},
				video_creator: {
					is_active: true
				}
			},
			select: {
				video_id: true,
				creator_user_id: true,
				is_video_exclusive: true
			}
		})
	} catch (error) {
		console.error(error)
		throw error
	}
}
