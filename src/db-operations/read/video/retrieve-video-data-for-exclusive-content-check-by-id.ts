import PrismaClientClass from "../../../classes/prisma-client"

export default async function retrieveVideoDataForExclusiveContentCheckById(
	videoId: number
): Promise<VideoDataNeededToCheckForExclusiveContentAccess | null> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()

		return await prismaClient.video.findUnique({
			where: {
				video_id: videoId
			},
			select: {
				video_id: true,
				creator_wallet_id: true,
				is_video_exclusive: true
			}
		})
	} catch (error) {
		console.error(error)
		throw error
	}
}
