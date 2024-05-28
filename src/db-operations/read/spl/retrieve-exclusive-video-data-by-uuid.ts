import _ from "lodash"
import PrismaClientClass from "../../../classes/prisma-client"

// eslint-disable-next-line max-lines-per-function
export default async function retrieveExclusiveVideoDataByUUID(videoUUID: string): Promise<ExclusiveVideoData | null> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()
		const exclusiveVideoData = await prismaClient.spl.findFirst({
			where: {
				uploaded_video: {
					uuid: videoUUID
				},
				is_spl_exclusive: true,
				value_needed_to_access_exclusive_content_usd: {
					not: null
				},
				allow_value_from_same_creator_tokens_for_exclusive_content: {
					not: null
				},
				instant_access_price_to_exclusive_content_usd: {
					not: null
				}, is_content_instantly_accessible: {
					not: null
				}
			},
			select: {
				spl_id: true,
				is_spl_exclusive: true,
				value_needed_to_access_exclusive_content_usd: true,
				is_content_instantly_accessible: true,
				instant_access_price_to_exclusive_content_usd: true,
				allow_value_from_same_creator_tokens_for_exclusive_content: true,
				public_key_address: true,
				listing_price_per_share_usd: true,
				creator_wallet_id: true,
				uploaded_video: {
					select: {
						uuid: true
					}
				}
			}
		})

		if (_.isNull(exclusiveVideoData)) return null

		const result: ExclusiveVideoData = {
			uuid: exclusiveVideoData.uploaded_video.uuid,
			spl_id: exclusiveVideoData.spl_id,
			is_spl_exclusive: exclusiveVideoData.is_spl_exclusive,
			value_needed_to_access_exclusive_content_usd: exclusiveVideoData.value_needed_to_access_exclusive_content_usd as number,
			is_content_instantly_accessible: exclusiveVideoData.is_content_instantly_accessible as boolean,
			// eslint-disable-next-line max-len
			allow_value_from_same_creator_tokens_for_exclusive_content: exclusiveVideoData.allow_value_from_same_creator_tokens_for_exclusive_content as boolean,
			instant_access_price_to_exclusive_content_usd: exclusiveVideoData.instant_access_price_to_exclusive_content_usd as number,
			public_key_address: exclusiveVideoData.public_key_address,
			listing_price_per_share_usd: exclusiveVideoData.listing_price_per_share_usd,
			creator_wallet_id: exclusiveVideoData.creator_wallet_id
		}

		return result
	} catch (error) {
		console.error(error)
		throw error
	}
}
