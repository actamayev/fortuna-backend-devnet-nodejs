import PrismaClientClass from "../../../classes/prisma-client"

// eslint-disable-next-line max-lines-per-function
export default async function retrieveHomePageVideos(): Promise<RetrievedHomePageVideosFromDB[]> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()

		const mediaDetails = await prismaClient.video.findMany({
			where: {
			},
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
				video_creator: {
					select: {
						username: true,
						profile_picture: {
							select: {
								image_url: true
							}
						},
						channel_banner: {
							select: {
								image_url: true
							}
						},
						channel_name: {
							select: {
								channel_name: true
							}
						}
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
		})

		const filteredVideos = mediaDetails
			.filter(video => video.video_creator.username !== null)
			.map(video => ({
				...video,
				numberOfExclusivePurchasesSoFar: video.is_video_exclusive ? video._count.exclusive_video_access_purchase : null
			}))
			// eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/no-unused-vars
			.map(({ _count, ...rest }) => rest) // Remove _count property

		return filteredVideos as RetrievedHomePageVideosFromDB[]
	} catch (error) {
		console.error(error)
		throw error
	}
}
