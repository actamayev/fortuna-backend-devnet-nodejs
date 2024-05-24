import PrismaClientClass from "../../../classes/prisma-client"

// eslint-disable-next-line max-lines-per-function
export default async function retrieveVideosByTitle(videoTitle: string): Promise<RetrievedVideosByTitle[]> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()
		const retrievedVideos = await prismaClient.spl.findMany({
			where: {
				spl_name: {
					contains: videoTitle,
					mode: "insensitive"
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

		const filteredVideos: RetrievedVideosByTitle[] = retrievedVideos.filter(video =>
			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
			video.spl_creator_wallet.user.username !== null
		) as RetrievedVideosByTitle[]

		return filteredVideos
	} catch (error) {
		console.error(error)
		throw error
	}
}
