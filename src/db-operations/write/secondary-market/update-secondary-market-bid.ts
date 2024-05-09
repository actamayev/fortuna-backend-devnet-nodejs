import PrismaClientClass from "../../../classes/prisma-client"

export default async function updateSecondaryMarketBid(bidId: number, newRemainingShareQuantity: number): Promise<void> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()
		await prismaClient.secondary_market_bid.update({
			where: {
				secondary_market_bid_id: bidId
			},
			data: {
				remaining_number_of_shares_bidding_for: newRemainingShareQuantity
			}
		})
	} catch (error) {
		console.error(error)
		throw error
	}
}
