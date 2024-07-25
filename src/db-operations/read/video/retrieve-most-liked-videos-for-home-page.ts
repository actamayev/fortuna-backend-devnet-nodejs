import PrismaClientClass from "../../../classes/prisma-client"

// eslint-disable-next-line max-lines-per-function
export default async function retrieveMostLikedVideosForHomePage(): Promise<RetrievedHomePageVideosFromDB[]> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()

		// Step 1: Aggregate to count likes for each video
		const likeCounts = await prismaClient.video_like_status.groupBy({
			by: ["video_id"],
			_count: {
				video_id: true
			},
			where: {
				is_active: true
			}
		})

		// Create a map of video IDs to their like counts
		const likeCountMap: { [key: number]: number } = {}
		likeCounts.forEach(item => {
			likeCountMap[item.video_id] = item._count.video_id
		})

		// Step 2: Query videos with filtering and ordering by likes
		const mediaDetails = await prismaClient.video.findMany({
			where: {
				video_id: {
					in: likeCounts.map(item => item.video_id)
				},
				video_listing_status: {
					notIn: ["UNLISTED", "SOLDOUT"]
				},
				video_creator: {
					is_active: true
				}
			},
			select: {
				video_id: true,
				video_name: true,
				video_listing_status: true,
				description: true,
				is_video_featured: true,
				creator_user_id: true,
				is_video_exclusive: true,
				uuid: true,
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
				video_creator: {
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
						}
					}
				},
				video_like_status: {
					select: {
						user_id: true
					},
					where: {
						is_active: true
					}
				},
				_count: {
					select: {
						exclusive_video_access_purchase: true,
						video_like_status: true // Count likes
					}
				}
			}
		})

		// Filter, map, and sort videos by like counts, then take the top 4
		const filteredVideos = mediaDetails
			.filter(video => video.video_creator.username !== null)
			.map(video => ({
				...video,
				numberOfExclusivePurchasesSoFar: video.is_video_exclusive ? video._count.exclusive_video_access_purchase : null,
				numberOfLikes: likeCountMap[video.video_id] || 0 // Add the number of likes
			}))
			.sort((a, b) => b.numberOfLikes - a.numberOfLikes) // Sort by like counts
			.slice(0, 4) // Take the top 4

		return filteredVideos as RetrievedHomePageVideosFromDB[]
	} catch (error) {
		console.error(error)
		throw error
	}
}
