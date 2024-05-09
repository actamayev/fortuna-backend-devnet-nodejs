import _ from "lodash"
import PrismaClientClass from "../../../classes/prisma-client"

// eslint-disable-next-line max-lines-per-function
export default async function retrieveVideoByUUID(videoUUID: string): Promise<HomePageVideoRetrievedFromDB | null> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()
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
						listing_price_per_share_usd: true,
						description: true,
						total_number_of_shares: true,
						public_key_address: true,
						original_content_url: true,
						uploaded_image: {
							select: {
								image_url: true
							}
						},
						spl_creator_wallet: {
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
				}
			}
		})

		if (
			_.isNull(retrievedVideo) ||
			_.isNull(retrievedVideo.spl) ||
			_.isNull(retrievedVideo.spl.spl_creator_wallet.user.username)
		) return null

		return {
			...retrievedVideo,
			spl: retrievedVideo.spl
		} as HomePageVideoRetrievedFromDB
	} catch (error) {
		console.error(error)
		throw error
	}
}
