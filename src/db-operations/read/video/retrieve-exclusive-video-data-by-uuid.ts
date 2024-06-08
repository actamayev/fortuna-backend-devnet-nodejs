import _ from "lodash"
import PrismaClientClass from "../../../classes/prisma-client"

// eslint-disable-next-line max-lines-per-function
export default async function retrieveExclusiveVideoDataByUUID(
	videoUUID: string,
	tierNumber: number
): Promise<ExclusiveVideoData | null> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()
		const exclusiveVideoData = await prismaClient.video.findFirst({
			where: {
				uuid: videoUUID,
				is_video_exclusive: true,
				video_access_tier: {
					some: {
						tier_number: tierNumber
					}
				}
			},
			select: {
				uuid: true,
				video_id: true,
				is_video_exclusive: true,
				creator_wallet_id: true,
				video_access_tier: {
					select: {
						video_access_tier_id: true,
						purchases_allowed_for_this_tier: true,
						tier_access_price_usd: true,
						is_sold_out: true
					},
					where: {
						tier_number: tierNumber
					}
				}
			}
		})

		if (_.isNull(exclusiveVideoData)) return null

		const tierData = exclusiveVideoData.video_access_tier[0]

		if (_.isNull(tierData.purchases_allowed_for_this_tier) || _.isNull(tierData.tier_access_price_usd)) return null

		const result: ExclusiveVideoData = {
			uuid: exclusiveVideoData.uuid,
			video_id: exclusiveVideoData.video_id,
			is_video_exclusive: exclusiveVideoData.is_video_exclusive,
			creator_wallet_id: exclusiveVideoData.creator_wallet_id,
			purchases_allowed_for_this_tier: tierData.purchases_allowed_for_this_tier,
			tier_access_price_usd: tierData.tier_access_price_usd,
			is_tier_sold_out: tierData.is_sold_out,
			video_access_tier_id: tierData.video_access_tier_id
		}

		return result
	} catch (error) {
		console.error(error)
		throw error
	}
}
