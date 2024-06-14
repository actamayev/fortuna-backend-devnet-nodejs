import _ from "lodash"
import PrismaClientClass from "../../../classes/prisma-client"

export default async function updateCheckIfVideoAccessTierSoldOut(
	exclusiveVideoData: ExclusiveVideoData,
	tierNumber: number
): Promise<boolean> {
	try {
		const purchasesAllowedForThisTier = exclusiveVideoData.purchases_allowed_for_this_tier
		if (_.isNull(purchasesAllowedForThisTier)) return false

		const prismaClient = await PrismaClientClass.getPrismaClient()

		return await prismaClient.$transaction(async (prisma) => {
			const numberPurchases = await prisma.video_access_tier.count({
				where: {
					video_id: exclusiveVideoData.video_id,
					tier_number: tierNumber
				}
			})

			if (numberPurchases < purchasesAllowedForThisTier) return false

			await prisma.video_access_tier.update({
				where: {
					video_access_tier_id: exclusiveVideoData.video_access_tier_id
				},
				data: {
					is_sold_out: true
				}
			})

			return true
		})
	} catch (error) {
		console.error(error)
		throw error
	}
}
