import PrismaClientClass from "../../../../classes/prisma-client"

export default async function updateSplTransferRecordWithTransactionId(
	splTransferIdArray: number[],
	secondaryMarketTransactionId: number
): Promise<void> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()
		for (const splTransferId of splTransferIdArray) {
			await prismaClient.spl_transfer.updateMany({
				where: {
					spl_transfer_id: splTransferId
				},
				data: {
					secondary_market_transaction_id: secondaryMarketTransactionId
				}
			})
		}
	} catch (error) {
		console.error(error)
		throw error
	}
}
