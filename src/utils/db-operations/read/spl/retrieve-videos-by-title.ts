import prismaClient from "../../../../prisma-client"

// eslint-disable-next-line max-lines-per-function
export default async function retrieveVideosByTitle(videoTitle: string): Promise<RetrievedVideosByTitle[]> {
	try {
		const retrievedVideos = await prismaClient.spl.findMany({
			where: {
				spl_name: {
					contains: videoTitle,
					mode: "insensitive"
				}
			},
			select: {
				spl_name: true,
				listing_price_per_share_sol: true,
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
				uploaded_video: {
					select: {
						uuid: true,
						created_at: true,
						video_url: true
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

		return retrievedVideos
	} catch (error) {
		console.error(error)
		throw error
	}
}
