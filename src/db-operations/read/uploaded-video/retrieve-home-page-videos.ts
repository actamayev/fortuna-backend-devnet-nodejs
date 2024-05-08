import PrismaClientClass from "../../../classes/prisma-client"

// eslint-disable-next-line max-lines-per-function
export default async function retrieveHomePageVideos(): Promise<HomePageVideoRetrievedFromDB[]> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()
		const mediaDetails = await prismaClient.uploaded_video.findMany({
			select: {
				video_url: true,
				created_at: true,
				uuid: true,
				spl: {
					select: {
						spl_name: true,
						listing_price_per_share: true,
						listing_currency_peg: true,
						description: true,
						total_number_of_shares: true,
						public_key_address: true,
						original_content_url: true,
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

		const filteredMediaDetails = mediaDetails.filter((media): media is HomePageVideoRetrievedFromDB => media.spl !== null)

		return filteredMediaDetails
	} catch (error) {
		console.error(error)
		throw error
	}
}
