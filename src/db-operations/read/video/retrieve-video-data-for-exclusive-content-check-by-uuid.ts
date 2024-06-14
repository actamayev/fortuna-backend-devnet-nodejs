import PrismaClientClass from "../../../classes/prisma-client"

export default async function retrieveVideoDataForExclusiveContentCheckByUUID(
	videoUUID: string
): Promise<VideoDataNeededToCheckForExclusiveContentAccess | null> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()

		return await prismaClient.video.findFirst({
			where: {
				uuid: videoUUID
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
