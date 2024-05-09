import PrismaClientClass from "../../../classes/prisma-client"

export default async function addSecondaryMarketTransaction(
	bidId: number,
	askId: number,
	solTransferId: number,
	splTransferId: number
): Promise<void> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()
		await prismaClient.secondary_market_transaction.create({
			data: {
				secondary_market_bid_id: bidId,
				secondary_market_ask_id: askId,
				sol_transfer_id: solTransferId,
				spl_transfer_id: splTransferId,
			}
		})
	} catch (error) {
		console.error("Error adding login record:", error)
		throw error
	}
}
