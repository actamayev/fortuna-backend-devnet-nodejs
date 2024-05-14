import PrismaClientClass from "../../../../classes/prisma-client"

export default async function cancelSecondaryMarketBid(bidId: number): Promise<void> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()
		await prismaClient.secondary_market_bid.update({
			where: {
				secondary_market_bid_id: bidId
			},
			data: {
				is_active: false
			}
		})
	} catch (error) {
		console.error(error)
		throw error
	}
}
