import PrismaClientClass from "../../../classes/prisma-client"

// eslint-disable-next-line max-lines-per-function
export default async function retrieveVideosByTitle(videoTitle: string): Promise<RetrievedHomePageVideo[]> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()
		const retrievedVideos = await prismaClient.spl.findMany({
			where: {
				spl_name: {
					contains: videoTitle,
					mode: "insensitive"
				},
				spl_listing_status: {
					notIn: ["PRELISTING", "REMOVED"]
				}
			},
			select: {
				spl_name: true,
				public_key_address: true,
				listing_price_per_share_usd: true,
				spl_listing_status: true,
				description: true,
				total_number_of_shares: true,
				original_content_url: true,
				is_spl_exclusive: true,
				spl_id: true,
				creator_wallet_id: true,
				value_needed_to_access_exclusive_content_usd: true,
				is_content_instantly_accessible: true,
				listing_price_to_access_exclusive_content_usd: true,
				allow_value_from_same_creator_tokens_for_exclusive_content: true,
				uploaded_image: {
					select: {
						image_url: true
					}
				},
				uploaded_video: {
					select: {
						uuid: true,
						created_at: true,
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
		})

		const filteredVideos = retrievedVideos.filter(video =>
			video.spl_creator_wallet.user.username !== null
		) as RetrievedHomePageVideo[]

		return filteredVideos
	} catch (error) {
		console.error(error)
		throw error
	}
}
