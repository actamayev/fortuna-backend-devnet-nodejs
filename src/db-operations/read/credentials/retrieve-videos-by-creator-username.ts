import _ from "lodash"
import PrismaClientClass from "../../../classes/prisma-client"

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
								listing_price_per_share_usd: true,
								spl_listing_status: true,
								description: true,
								total_number_of_shares: true,
								public_key_address: true,
								original_content_url: true,
								is_spl_exclusive: true,
								creator_wallet_id: true,
								spl_id: true,
								value_needed_to_access_exclusive_content_usd: true,
								is_content_instantly_accessible: true,
								allow_value_from_same_creator_tokens_for_exclusive_content: true,
								listing_price_to_access_exclusive_content_usd: true,
								uploaded_image: {
									select: {
										image_url: true
									}
								},
								uploaded_video: {
									select: {
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
