import _ from "lodash"
import PrismaClientClass from "../../../classes/prisma-client"

export default async function retrieveVideoDataForExclusiveContent(
	videoUUID: string
): Promise<VideoDataNeededToCheckForExclusiveContentAccess | null> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()
		const retrievedVideoWithExclusiveInfo = await prismaClient.video.findFirst({
			where: {
				uuid: videoUUID
			},
			select: {
				video_id: true,
				creator_wallet_id: true,
				is_video_exclusive: true,
			}
		})

		if (_.isNull(retrievedVideoWithExclusiveInfo)) return null

		return retrievedVideoWithExclusiveInfo
	} catch (error) {
		console.error(error)
		throw error
	}
}
