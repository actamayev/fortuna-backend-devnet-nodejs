import PrismaClientClass from "../../../../classes/prisma-client"

export default async function addSecondaryMarketBid(
	splId: number,
	solanaWalletId: number,
	createSplBid: CreateSplBidData
): Promise<number> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()
		const marketBid = await prismaClient.secondary_market_bid.create({
			data: {
				spl_id: splId,
				solana_wallet_id: solanaWalletId,
				number_of_shares_bidding_for: createSplBid.numberOfSharesBiddingFor,
				remaining_number_of_shares_bidding_for: createSplBid.numberOfSharesBiddingFor,
				bid_price_per_share_usd: createSplBid.bidPricePerShareUsd,
			}
		})

		return marketBid.secondary_market_bid_id
	} catch (error) {
		console.error("Error adding secondary market bid record:", error)
		throw error
	}
}
