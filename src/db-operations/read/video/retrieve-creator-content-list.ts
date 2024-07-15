import PrismaClientClass from "../../../classes/prisma-client"

// eslint-disable-next-line max-lines-per-function
export default async function retrieveCreatorContentList(userId: number): Promise<RetrievedCreatorDBVideoData[]> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()

		const creatorVideoData = await prismaClient.video.findMany({
			where: {
				creator_user_id: userId
			},
			orderBy: {
				created_at: "desc"
			},
			select: {
				video_id: true,
				video_name: true,
				video_listing_status: true,
				description: true,
				uuid: true,
				is_video_exclusive: true,
				created_at: true,
				uploaded_image: {
					select: {
						image_url: true
					}
				},
				uploaded_video: {
					select: {
						video_duration_seconds: true
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
				exclusive_video_access_purchase: {
					select: {
						exclusive_video_access_purchase_sol_transfer: {
							select: {
								sol_amount_transferred: true,
								usd_amount_transferred: true
							}
						}
					}
				},
				_count: {
					select: {
						video_like_status: {
							where: {
								is_active: true
							}
						},
						exclusive_video_access_purchase: true
					}
				}
			}
		})

		const filteredVideo = creatorVideoData
			.map(video => ({
				...video,
				numberOfExclusivePurchasesSoFar: video.is_video_exclusive ? video._count.exclusive_video_access_purchase : null,
				numberOfLikes: video._count.video_like_status
			}))
			// eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/no-unused-vars
			.map(({ _count, ...rest }) => rest) // Remove _count property

		return filteredVideo
	} catch (error) {
		console.error(error)
		throw error
	}
}
