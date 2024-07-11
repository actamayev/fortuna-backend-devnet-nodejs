import PrismaClientClass from "../../../classes/prisma-client"

export default async function retrieveNonExclusiveVideoByUUID(videoUUID: string): Promise<NonExclusiveVideoData | null> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()

		return await prismaClient.video.findFirst({
			where: {
				uuid: videoUUID,
				is_video_exclusive: {
					not: true
				}
			},
			select: {
				video_id: true,
				video_listing_status: true,
				creator_user_id: true
			}
		})
	} catch (error) {
		console.error(error)
		throw error
	}
}
