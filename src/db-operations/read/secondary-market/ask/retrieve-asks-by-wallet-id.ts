import PrismaClientClass from "../../../../classes/prisma-client"

export default async function retrieveAsksByWalletId(solanaWalletId: number): Promise<RetrievedUserAskData[]> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()
		const asks = await prismaClient.secondary_market_ask.findMany({
			where: {
				solana_wallet_id: solanaWalletId
			},
			select: {
				secondary_market_ask_id: true,
				spl_id: true,
				number_of_shares_for_sale: true,
				remaining_number_of_shares_for_sale: true,
				ask_price_per_share_usd: true,
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
