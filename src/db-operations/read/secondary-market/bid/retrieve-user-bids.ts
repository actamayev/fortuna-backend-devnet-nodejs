import PrismaClientClass from "../../../../classes/prisma-client"

export default async function retrieveUserBids(userId: number): Promise<RetrievedUserBidData[]> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()
		const asks = await prismaClient.secondary_market_bid.findMany({
			where: {
				solana_wallet: {
					user_id: userId
				}
			},
			select: {
				secondary_market_bid_id: true,
				spl_id: true,
				bid_price_per_share_usd: true,
				was_bid_cancelled_due_to_fund_requirements: true,
				number_of_shares_bidding_for: true,
				remaining_number_of_shares_bidding_for: true,
				created_at: true
			}
		})

		return asks
	} catch (error) {
		console.error(error)
		throw error
	}
}
