import PrismaClientClass from "../../../../classes/prisma-client"

export default async function retrieveOpenUserAsksByWalletIdAndSplId(
	solanaWalletId: number,
	splId: number
): Promise<{ remaining_number_of_shares_for_sale: number }[]> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()
		const asks = await prismaClient.secondary_market_ask.findMany({
			where: {
				spl_id: splId,
				solana_wallet_id: solanaWalletId,
				is_active: true,
				remaining_number_of_shares_for_sale: {
					gt: 0
				}
			},
			select: {
				remaining_number_of_shares_for_sale: true
			}
		})

		return asks
	} catch (error) {
		console.error(error)
		throw error
	}
}
