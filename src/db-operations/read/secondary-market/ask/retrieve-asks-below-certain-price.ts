import PrismaClientClass from "../../../../classes/prisma-client"

export default async function retrieveAsksBelowCertainPrice(
	splId: number,
	bidPrice: number,
	solanaWalletIdToNotInclude: number
): Promise<RetrievedUserAskDataBelowCertainPrice[]> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()
		const asks = await prismaClient.secondary_market_ask.findMany({
			where: {
				is_active: true,
				spl_id: splId,
				remaining_number_of_shares_for_sale: {
					gt: 0
				},
				ask_price_per_share_usd: {
					lte: bidPrice
				},
				solana_wallet_id: {
					not: solanaWalletIdToNotInclude
				}
			},
			orderBy: {
				ask_price_per_share_usd: "asc"
			},
			select: {
				secondary_market_ask_id: true,
				spl_id: true,
				remaining_number_of_shares_for_sale: true,
				ask_price_per_share_usd: true,
				solana_wallet: true
			}
		})

		return asks as RetrievedUserAskDataBelowCertainPrice[]
	} catch (error) {
		console.error(error)
		throw error
	}
}
