import _ from "lodash"
import PrismaClientClass from "../../../../classes/prisma-client"

// eslint-disable-next-line max-lines-per-function
export default async function retrieveVideosByCreatorUsername(creatorUsername: string): Promise<RetrievedVideosByCreatorUsername | null> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()
		const retrievedVideos = await prismaClient.credentials.findUnique({
			where: {
				username: creatorUsername,
				is_approved_to_be_creator: true
			},
			select: {
				username: true,
				profile_picture: {
					select: {
						image_url: true
					}
				},
				solana_wallet: {
					select: {
						spl_creator_wallet: {
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
								uploaded_video: {
									select: {
										video_url: true,
										created_at: true,
										uuid: true
									}
								}
							}
						}
					}
				}
			}
		})

		if (_.isNull(retrievedVideos) || _.isNull(retrievedVideos.username)) return null

		return retrievedVideos as RetrievedVideosByCreatorUsername
	} catch (error) {
		console.error(error)
		throw error
	}
}
