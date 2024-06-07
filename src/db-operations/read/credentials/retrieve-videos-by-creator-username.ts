import _ from "lodash"
import PrismaClientClass from "../../../classes/prisma-client"

// eslint-disable-next-line max-lines-per-function
export default async function retrieveVideosByCreatorUsername(creatorUsername: string): Promise<RetrievedVideosByCreatorUsername | null> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()
		const retrievedVideos = await prismaClient.credentials.findUnique({
			where: {
				username: creatorUsername
			},
			select: {
				username: true,
				profile_picture: {
					select: {
						image_url: true
					}
				},
				solana_wallet: {
					select: {
						video_creator_wallet: {
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
								_count: {
									select: {
										exclusive_video_access_purchase: true
									}
								}
							}
						}
					}
				}
			}
		})

		if (_.isNull(retrievedVideos) || _.isNull(retrievedVideos.username)) return null

		const videosWithPurchaseCount = retrievedVideos.solana_wallet?.video_creator_wallet.map(video => ({
			...video,
			numberOfExclusivePurchasesSoFar: video._count.exclusive_video_access_purchase
		// eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/no-unused-vars
		})).map(({ _count, ...rest }) => rest) || []

		return {
			...retrievedVideos,
			solana_wallet: {
				...retrievedVideos.solana_wallet,
				video_creator_wallet: videosWithPurchaseCount
			}
		} as RetrievedVideosByCreatorUsername
	} catch (error) {
		console.error(error)
		throw error
	}
}
