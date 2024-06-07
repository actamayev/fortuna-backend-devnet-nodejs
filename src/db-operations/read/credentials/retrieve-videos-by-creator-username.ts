import _ from "lodash"
import PrismaClientClass from "../../../classes/prisma-client"

// eslint-disable-next-line max-lines-per-function
export default async function retrieveVideosByCreatorUsername(creatorUsername: string): Promise<RetrievedVideosByCreatorUsername | null> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()
		const retrievedVideos = await prismaClient.credentials.findUnique({
			where: {
				username: creatorUsername
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
						video_creator_wallet: {
							select: {
								video_name: true,
								video_listing_status: true,
								description: true,
								is_video_exclusive: true,
								creator_wallet_id: true,
								video_id: true,
								uuid: true,
								created_at: true,
								uploaded_image: {
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

		if (_.isNull(retrievedVideos) || _.isNull(retrievedVideos.username)) return null

		return retrievedVideos as RetrievedVideosByCreatorUsername
	} catch (error) {
		console.error(error)
		throw error
	}
}
