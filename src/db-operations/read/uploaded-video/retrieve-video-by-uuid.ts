import _ from "lodash"
import PrismaClientClass from "../../../classes/prisma-client"

// eslint-disable-next-line max-lines-per-function
export default async function retrieveVideoByUUID(videoUUID: string): Promise<HomePageVideoRetrievedFromDB | null> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()
		const retrievedVideo = await prismaClient.uploaded_video.findFirst({
			where: {
				uuid: videoUUID
			},
			select: {
				created_at: true,
				uuid: true,
				spl: {
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
						allow_value_from_same_creator_tokens_for_exclusive_content: true,
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

		if (
			_.isNull(retrievedVideo) ||
			_.isNull(retrievedVideo.spl) ||
			_.isNull(retrievedVideo.spl.spl_creator_wallet.user.username)
		) return null

		return {
			...retrievedVideo,
			spl: retrievedVideo.spl
		} as HomePageVideoRetrievedFromDB
	} catch (error) {
		console.error(error)
		throw error
	}
}
