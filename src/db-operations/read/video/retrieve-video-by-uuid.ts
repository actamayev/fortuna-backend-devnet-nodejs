import _ from "lodash"
import PrismaClientClass from "../../../classes/prisma-client"

// eslint-disable-next-line max-lines-per-function
export default async function retrieveVideoByUUID(videoUUID: string): Promise<RetrievedHomePageVideosFromDB | null> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()
		const retrievedVideo = await prismaClient.video.findFirst({
			where: {
				uuid: videoUUID,
				video_listing_status: {
					notIn: ["PRELISTING", "REMOVED"]
				}
			},
			select: {
				video_id: true,
				video_name: true,
				listing_price_to_access_usd: true,
				video_listing_status: true,
				description: true,
				creator_wallet_id: true,
				is_video_exclusive: true,
				uuid: true,
				created_at: true,
				uploaded_image: {
					select: {
						image_url: true
					}
				},
				video_creator_wallet: {
					select: {
						user: {
							select: {
								username: true,
								profile_picture: {
									select: {
										image_url: true
									}
								}
							}
						}
					}
				}
			}
		})

		if (
			_.isNull(retrievedVideo) ||
			_.isNull(retrievedVideo.video_creator_wallet.user.username)
		) return null

		return retrievedVideo as RetrievedHomePageVideosFromDB
	} catch (error) {
		console.error(error)
		throw error
	}
}
