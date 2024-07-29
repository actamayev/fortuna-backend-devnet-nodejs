import _ from "lodash"
import PrismaClientClass from "../../../classes/prisma-client"

// eslint-disable-next-line max-lines-per-function
export default async function retrieveVideosByTag(videoTag: string): Promise<RetrievedHomePageVideosFromDB[] | null> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()

		const retrievedVideos = await prismaClient.video_tag_lookup.findUnique({
			where: {
				video_tag: videoTag
			},
			select: {
				video_tag_mapping: {
					where: {
						is_active: true
					},
					select: {
						video: {
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
								video_tag_mapping: {
									select: {
										video_tag_lookup: {
											select: {
												video_tag: true
											}
										}
									},
									where: {
										is_active: true
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
										channel_name: true
									}
								},
								_count: {
									select: {
										exclusive_video_access_purchase: true
									}
								}
							},
							// ASAP TODO: where: {
							// 	video_listing_status: {
							// 		not: "UNLISTED"
							// 	}
							// }
						}
					}
				}
			}
		})

		if (_.isNull(retrievedVideos)) return null

		const filteredVideos = retrievedVideos.video_tag_mapping
			.filter(mapping => mapping.video.video_creator.username !== null)
			.map(mapping => ({
				...mapping.video,
				numberOfExclusivePurchasesSoFar: mapping.video.is_video_exclusive ?
					mapping.video._count.exclusive_video_access_purchase : null
			}))
			// eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/no-unused-vars
			.map(({ _count, ...rest }) => rest)

		return filteredVideos as RetrievedHomePageVideosFromDB[]
	} catch (error) {
		console.error(error)
		throw error
	}
}
