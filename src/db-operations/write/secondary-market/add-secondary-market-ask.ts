import PrismaClientClass from "../../../classes/prisma-client"

export default async function addSecondaryMarketAsk(
	splId: number,
	solanaWalletId: number,
	createSplAsk: CreateSplAskData
): Promise<number> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()
		const marketAsk = await prismaClient.secondary_market_ask.create({
			data: {
				spl_id: splId,
				solana_wallet_id: solanaWalletId,
				number_of_shares_for_sale: createSplAsk.numberOfSharesAskingFor,
				remaining_number_of_shares_for_sale: createSplAsk.numberOfSharesAskingFor,
				ask_price_per_share_usd: createSplAsk.askPricePerShareUsd
			}
		})

		return marketAsk.secondary_market_ask_id
	} catch (error) {
		console.error("Error adding login record:", error)
		throw error
	}
}
