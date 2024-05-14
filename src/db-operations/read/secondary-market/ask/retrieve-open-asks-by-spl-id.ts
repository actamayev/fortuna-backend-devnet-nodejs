import PrismaClientClass from "../../../../classes/prisma-client"

export default async function retrieveOpenAsksBySplId(splId: number): Promise<RetrievedOpenAskOrdersData[]> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()
		const asks = await prismaClient.secondary_market_ask.findMany({
			where: {
				spl_id: splId,
				is_active: true,
				remaining_number_of_shares_for_sale: {
					gt: 0
				}
			},
			select: {
				secondary_market_ask_id: true,
				spl_id: true,
				ask_price_per_share_usd: true
			}
		})

		return asks
	} catch (error) {
		console.error(error)
		throw error
	}
}
