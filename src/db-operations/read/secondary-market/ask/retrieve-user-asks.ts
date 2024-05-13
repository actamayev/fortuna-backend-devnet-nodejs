import PrismaClientClass from "../../../../classes/prisma-client"

export default async function retrieveUserAsks(userId: number): Promise<RetrievedAsks[]> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()
		const asks = await prismaClient.secondary_market_ask.findMany({
			where: {
				solana_wallet: {
					user_id: userId
				}
			},
			select: {
				secondary_market_ask_id: true,
				spl_id: true,
				number_of_shares_for_sale: true,
				remaining_number_of_shares_for_sale: true,
				ask_price_per_share_usd: true,
				created_at: true
			}
		})

		return asks
	} catch (error) {
		console.error(error)
		throw error
	}
}
