import PrismaClientClass from "../../../classes/prisma-client"

export default async function updateExistingBidsToAdjustToFundReqs(
	solanaWalletId: number,
	remainingWalletBalanceUsd: number
): Promise<void> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()
		await prismaClient.secondary_market_bid.updateMany({
			where: {
				solana_wallet_id: solanaWalletId,
				remaining_number_of_shares_bidding_for: {
					gt: 0
				},
				bid_price_per_share_usd: {
					gt: remainingWalletBalanceUsd
				}
			},
			data: {
				was_bid_cancelled_due_to_fund_requirements: true
			}
		})
	} catch (error) {
		console.error(error)
		throw error
	}
}
