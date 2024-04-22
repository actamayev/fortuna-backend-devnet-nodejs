import prismaClient from "../../../../prisma-client"

// eslint-disable-next-line max-lines-per-function
export default async function retrieveHomePageVideos(): Promise<HomePageVideoRetrievedFromDB[]> {
	try {
		const mediaDetails = await prismaClient.uploaded_video.findMany({
			select: {
				video_url: true,
				created_at: true,
				uuid: true,
				spl: {
					select: {
						spl_name: true,
						listing_price_per_share_sol: true,
						listing_price_per_share_usd: true,
						description: true,
						total_number_of_shares: true,
						public_key_address: true,
						uploaded_image: {
							select: {
								image_url: true
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
				}
			}
		})

		return mediaDetails
	} catch (error) {
		console.error(error)
		throw error
	}
}
