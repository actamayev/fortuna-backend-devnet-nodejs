import PrismaClientClass from "../../../classes/prisma-client"

export default async function retrieveSplDataForExclusiveContent(
	videoUUID: string
): Promise<SplDataNeededToCheckForExclusiveContentAccess | null> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()
		const retrievedSplWithExclusiveInfo = await prismaClient.spl.findFirst({
			where: {
				uploaded_video: {
					uuid: videoUUID
				}
			},
			select: {
				public_key_address: true,
				listing_price_per_share_usd: true,
				original_content_url: true,
				is_spl_exclusive: true,
				creator_wallet_id: true,
				spl_id: true,
				value_needed_to_access_exclusive_content_usd: true,
				allow_value_from_same_creator_tokens_for_exclusive_content: true,

			}
		})

		return retrievedSplWithExclusiveInfo
	} catch (error) {
		console.error(error)
		throw error
	}
}
