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
					},
					where: {
						is_active: true
					}
				},
				channel_banner: {
					select: {
						image_url: true
					},
					where: {
						is_active: true
					}
				},
				channel_name: {
					select: {
						channel_name: true
					}
				},
				video: {
					select: {
						video_id: true,
						video_name: true,
						video_listing_status: true,
						description: true,
						creator_user_id: true,
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
								tier_access_price_usd: true,
								is_sold_out: true
							}
						},
						video_like_status: {
							select: {
								like_status: true,
								user_id: true
							},
							where: {
								is_active: true
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
		})

		if (_.isNull(retrievedVideos) || _.isNull(retrievedVideos.username)) return null

		const videosWithPurchaseCount = retrievedVideos.video.map(video => ({
			...video,
			numberOfExclusivePurchasesSoFar: video.is_video_exclusive ? video._count.exclusive_video_access_purchase : null
		// eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/no-unused-vars
		})).map(({ _count, ...rest }) => rest)

		return {
			videos: videosWithPurchaseCount,
			username: retrievedVideos.username,
			profile_picture_image_url: retrievedVideos.profile_picture?.image_url || null,
			channel_banner_image_url: retrievedVideos.channel_banner?.image_url || null,
			channel_name: retrievedVideos.channel_name?.channel_name || retrievedVideos.username
		}
	} catch (error) {
		console.error(error)
		throw error
	}
}
