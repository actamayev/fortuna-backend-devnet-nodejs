import PrismaClientClass from "../../../../classes/prisma-client"

export default async function checkIfActiveBidByUserExists(bidId: number, userId: number): Promise<boolean> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()
		const bid = await prismaClient.secondary_market_bid.findFirst({
			where: {
				is_active: true,
				was_bid_cancelled_due_to_fund_requirements: false,
				secondary_market_bid_id: bidId,
				solana_wallet: {
					user_id: userId
				}
			}
		})

		return bid !== null
	} catch (error) {
		console.error(error)
		throw error
	}
}
