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
				listing_price_to_access_exclusive_content_usd: {
					not: null
				}
			},
			select: {
				spl_id: true,
				is_spl_exclusive: true,
				value_needed_to_access_exclusive_content_usd: true,
				allow_value_from_same_creator_tokens_for_exclusive_content: true,
				listing_price_to_access_exclusive_content_usd: true,
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
			// eslint-disable-next-line max-len
			allow_value_from_same_creator_tokens_for_exclusive_content: exclusiveVideoData.allow_value_from_same_creator_tokens_for_exclusive_content as boolean,
			listing_price_to_access_exclusive_content_usd: exclusiveVideoData.listing_price_to_access_exclusive_content_usd as number
		}

		return result
	} catch (error) {
		console.error(error)
		throw error
	}
}
