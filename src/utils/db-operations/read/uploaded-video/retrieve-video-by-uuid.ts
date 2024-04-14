import _ from "lodash"
import prismaClient from "../../../../prisma-client"

export default async function retrieveVideoByUUID(videoUUID: string): Promise<VideoRetrievedFromDB | null> {
	try {
		const retrievedVideo = await prismaClient.uploaded_video.findFirst({
			where: {
				uuid: videoUUID
			},
			select: {
				video_url: true,
				created_at: true,
				uuid: true,
				spl: {
					select: {
						spl_name: true,
						listing_price_per_share_sol: true,
						description: true
					},
					take: 1
				}
			}
		})

		if (_.isNull(retrievedVideo)) return null

		return {
			...retrievedVideo,
			spl: retrievedVideo.spl[0]
		}
	} catch (error) {
		console.error(error)
		throw error
	}
}
