import _ from "lodash"
import PrismaClientClass from "../../../classes/prisma-client"

export default async function retrieveSplDataForExclusiveContent(
	videoUUID: string
): Promise<SplDataNeededToCheckForExclusiveContentAccess | null> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()
		const retrievedSplWithExclusiveInfo = await prismaClient.uploaded_video.findFirst({
			where: {
				uuid: videoUUID
			},
			select: {
				spl: {
					select: {
						spl_id: true,
						is_spl_exclusive: true,
						value_needed_to_access_exclusive_content_usd: true,
						public_key_address: true,
						listing_price_per_share_usd: true,
						creator_wallet_id: true,
						allow_value_from_same_creator_tokens_for_exclusive_content: true,
					}
				}
			}
		})

		if (_.isNull(retrievedSplWithExclusiveInfo) || _.isNull(retrievedSplWithExclusiveInfo.spl)) return null

		return retrievedSplWithExclusiveInfo.spl
	} catch (error) {
		console.error(error)
		throw error
	}
}
