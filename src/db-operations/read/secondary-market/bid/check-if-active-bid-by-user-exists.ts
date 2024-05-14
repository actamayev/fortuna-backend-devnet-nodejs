import { secondary_market_bid } from "@prisma/client"
import PrismaClientClass from "../../../../classes/prisma-client"

export default async function checkIfActiveBidByUserExists(bidId: number): Promise<secondary_market_bid | null> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()
		const bid = await prismaClient.secondary_market_bid.findFirst({
			where: {
				is_active: true,
				was_bid_cancelled_due_to_fund_requirements: false,
				secondary_market_bid_id: bidId
			}
		})

		return bid
	} catch (error) {
		console.error(error)
		throw error
	}
}
