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
				video_access_tier: {
					select: {
						tier_number: true,
						purchases_allowed_for_this_tier: true,
						percent_discount_at_this_tier: true,
						tier_access_price_usd: true
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
				},
				_count: {
					select: {
						exclusive_video_access_purchase: true
					}
				}
			}
		})

		if (_.isNull(retrievedVideo) || _.isNull(retrievedVideo.video_creator_wallet.user.username)) {
			return null
		}

		const videoWithPurchaseCount = {
			...retrievedVideo,
			// eslint-disable-next-line max-len
			numberOfExclusivePurchasesSoFar: retrievedVideo.is_video_exclusive ? retrievedVideo._count.exclusive_video_access_purchase : null
		}

		// eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/no-unused-vars
		const { _count, ...videoWithoutCount } = videoWithPurchaseCount

		return videoWithoutCount as RetrievedHomePageVideosFromDB
	} catch (error) {
		console.error(error)
		throw error
	}
}
