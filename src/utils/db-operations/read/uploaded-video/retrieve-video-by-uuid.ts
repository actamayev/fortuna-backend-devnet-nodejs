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
						listing_price_per_share_usd: true,
						description: true,
						total_number_of_shares: true,
						public_key_address: true,
						spl_creator_wallet: {
							select: {
								user: {
									select: { username: true }
								}
							}
						}
					}
				}
			}
		})

		if (_.isNull(retrievedVideo) || _.isNull(retrievedVideo.spl)) return null

		return {
			...retrievedVideo,
			spl: retrievedVideo.spl
		}
	} catch (error) {
		console.error(error)
		throw error
	}
}
