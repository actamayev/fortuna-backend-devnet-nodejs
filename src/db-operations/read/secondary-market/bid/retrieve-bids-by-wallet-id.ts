import PrismaClientClass from "../../../../classes/prisma-client"

export default async function retrieveBidsByWalletId(solanaWalletId: number): Promise<RetrievedUserBidData[]> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()
		const asks = await prismaClient.secondary_market_bid.findMany({
			where: {
				solana_wallet_id: solanaWalletId
			},
			select: {
				secondary_market_bid_id: true,
				spl_id: true,
				bid_price_per_share_usd: true,
				was_bid_cancelled_due_to_fund_requirements: true,
				number_of_shares_bidding_for: true,
				remaining_number_of_shares_bidding_for: true,
				created_at: true,
				spl: {
					select: {
						spl_name: true,
						uploaded_video: {
							select: {
								uuid: true
							}
						}
					}
				}
			}
		})

		return asks
	} catch (error) {
		console.error(error)
		throw error
	}
}
