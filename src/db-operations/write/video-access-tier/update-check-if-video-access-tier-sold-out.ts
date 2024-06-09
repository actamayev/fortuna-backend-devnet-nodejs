import _ from "lodash"
import PrismaClientClass from "../../../classes/prisma-client"

export default async function updateCheckIfVideoAccessTierSoldOut(
	exclusiveVideoData: ExclusiveVideoData,
	tierNumber: number,
): Promise<boolean> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()
		const numberPurchases = await prismaClient.video_access_tier.count({
			where: {
				video_id: exclusiveVideoData.video_id,
				tier_number: tierNumber
			}
		})

		if (
			_.isNull(exclusiveVideoData.purchases_allowed_for_this_tier) ||
			numberPurchases < exclusiveVideoData.purchases_allowed_for_this_tier
		) return false

		await prismaClient.video_access_tier.update({
			where: {
				video_access_tier_id: exclusiveVideoData.video_access_tier_id
			},
			data: {
				is_sold_out: true
			}
		})
		return true
	} catch (error) {
		console.error(error)
		throw error
	}
}
