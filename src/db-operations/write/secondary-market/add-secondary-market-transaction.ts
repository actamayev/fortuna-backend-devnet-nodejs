import PrismaClientClass from "../../../classes/prisma-client"

export default async function addSecondaryMarketTransaction(
	bidId: number,
	askId: number,
	solTransferId: number,
): Promise<number> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()
		const secondaryMarketTransaction = await prismaClient.secondary_market_transaction.create({
			data: {
				secondary_market_bid_id: bidId,
				secondary_market_ask_id: askId,
				sol_transfer_id: solTransferId,
			}
		})

		return secondaryMarketTransaction.secondary_market_transaction_id
	} catch (error) {
		console.error("Error secondary market transaction record:", error)
		throw error
	}
}
