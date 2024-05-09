import PrismaClientClass from "../../../classes/prisma-client"

export default async function retrieveBidsAboveCertainPrice(
	splId: number,
	askPrice: number
): Promise<RetrievedBidsAboveCertainPrice[]> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()
		const asks = await prismaClient.secondary_market_bid.findMany({
			where: {
				is_active: true,
				spl_id: splId,
				remaining_number_of_shares_bidding_for: {
					gt: 0
				},
				bid_price_per_share_usd: {
					gte: askPrice
				}
			},
			orderBy: {
				bid_price_per_share_usd: "desc"
			},
			select: {
				secondary_market_bid_id: true,
				spl_id: true,
				remaining_number_of_shares_bidding_for: true,
				bid_price_per_share_usd: true,
				solana_wallet: true,
			}
		})

		return asks as RetrievedBidsAboveCertainPrice[]
	} catch (error) {
		console.error(error)
		throw error
	}
}
