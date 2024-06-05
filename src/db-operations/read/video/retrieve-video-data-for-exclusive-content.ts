import _ from "lodash"
import PrismaClientClass from "../../../classes/prisma-client"

export default async function retrieveSplDataForExclusiveContent(
	videoUUID: string
): Promise<VideoDataNeededToCheckForExclusiveContentAccess | null> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()
		const retrievedSplWithExclusiveInfo = await prismaClient.video.findFirst({
			where: {
				uuid: videoUUID
			},
			select: {
				video_id: true,
				creator_wallet_id: true,
				is_video_exclusive: true,
				listing_price_to_access_usd: true,
			}
		})

		if (_.isNull(retrievedSplWithExclusiveInfo)) return null

		return retrievedSplWithExclusiveInfo
	} catch (error) {
		console.error(error)
		throw error
	}
}
