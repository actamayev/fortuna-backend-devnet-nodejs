import _ from "lodash"
import PrismaClientClass from "../../../classes/prisma-client"

// eslint-disable-next-line max-lines-per-function
export default async function retrieveExclusiveVideoDataByUUID(videoUUID: string): Promise<ExclusiveVideoData | null> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()
		const exclusiveVideoData = await prismaClient.video.findFirst({
			where: {
				uuid: videoUUID,
				is_video_exclusive: true
			},
			select: {
				uuid: true,
				video_id: true,
				is_video_exclusive: true,
				listing_price_to_access_usd: true,
				creator_wallet_id: true
			}
		})

		if (_.isNull(exclusiveVideoData)) return null

		const result: ExclusiveVideoData = {
			uuid: exclusiveVideoData.uuid,
			video_id: exclusiveVideoData.video_id,
			is_video_exclusive: exclusiveVideoData.is_video_exclusive,
			listing_price_to_access_usd: exclusiveVideoData.listing_price_to_access_usd,
			creator_wallet_id: exclusiveVideoData.creator_wallet_id
		}

		return result
	} catch (error) {
		console.error(error)
		throw error
	}
}
