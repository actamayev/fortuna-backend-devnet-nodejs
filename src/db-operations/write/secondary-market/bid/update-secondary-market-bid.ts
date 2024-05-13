import PrismaClientClass from "../../../../classes/prisma-client"

export async function updateSecondaryMarketBidSet(bidId: number, newRemainingShareQuantity: number): Promise<void> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()
		await prismaClient.secondary_market_bid.update({
			where: {
				secondary_market_bid_id: bidId
			},
			data: {
				remaining_number_of_shares_bidding_for: newRemainingShareQuantity,
			}
		})
	} catch (error) {
		console.error(error)
		throw error
	}
}

export async function updateSecondaryMarketBidDecrement(bidId: number, sharesToDecrementBy: number): Promise<void> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()
		await prismaClient.secondary_market_bid.update({
			where: {
				secondary_market_bid_id: bidId
			},
			data: {
				remaining_number_of_shares_bidding_for: {
					decrement: sharesToDecrementBy
				},
			}
		})
	} catch (error) {
		console.error(error)
		throw error
	}
}
