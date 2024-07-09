import _ from "lodash"
import PrismaClientClass from "../../../classes/prisma-client"

export default async function retrieveNonExclusiveVideoByUUID(videoUUID: string): Promise<NonExclusiveVideoData | null> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()

		const retrievedVideo = await prismaClient.video.findFirst({
			where: {
				uuid: videoUUID
			},
			select: {
				video_id: true,
				video_listing_status: true,
				is_video_exclusive: true,
				video_creator: {
					select: {
						user_id: true
					}
				}
			}
		})

		if (_.isNull(retrievedVideo)) return null

		return {
			videoId: retrievedVideo.video_id,
			videoListingStatus: retrievedVideo.video_listing_status,
			isVideoExclusive: retrievedVideo.is_video_exclusive,
			userId: retrievedVideo.video_creator.user_id
		}
	} catch (error) {
		console.error(error)
		throw error
	}
}
