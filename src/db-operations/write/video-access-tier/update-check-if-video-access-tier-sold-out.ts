import PrismaClientClass from "../../../classes/prisma-client"

export default async function updateCheckIfVideoAccessTierSoldOut(
	exclusiveVideoData: ExclusiveVideoData,
	tierNumber: number,
): Promise<void> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()
		const numberPurchases = await prismaClient.video_access_tier.count({
			where: {
				video_id: exclusiveVideoData.video_id,
				tier_number: tierNumber
			}
		})

		if (numberPurchases < exclusiveVideoData.purchases_allowed_for_this_tier) return

		await prismaClient.video_access_tier.update({
			where: {
				video_access_tier_id: exclusiveVideoData.video_access_tier_id
			},
			data: {
				is_sold_out: true
			}
		})
	} catch (error) {
		console.error(error)
		throw error
	}
}
