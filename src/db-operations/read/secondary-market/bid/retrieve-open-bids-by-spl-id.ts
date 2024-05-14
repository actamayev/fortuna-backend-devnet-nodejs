import PrismaClientClass from "../../../../classes/prisma-client"

export default async function retrieveOpenBidsBySplId(splId: number): Promise<RetrievedOpenBidOrdersData[]> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()
		const bids = await prismaClient.secondary_market_bid.findMany({
			where: {
				spl_id: splId,
				is_active: true,
				remaining_number_of_shares_bidding_for: {
					gt: 0
				},
				was_bid_cancelled_due_to_fund_requirements: false
			},
			select: {
				secondary_market_bid_id: true,
				spl_id: true,
				bid_price_per_share_usd: true
			}
		})

		return bids
	} catch (error) {
		console.error(error)
		throw error
	}
}
