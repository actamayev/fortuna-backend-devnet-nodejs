import PrismaClientClass from "../../../../classes/prisma-client"

export async function updateSplTransferRecordWithTransactionId(
	splTransferId: number,
	secondaryMarketTransactionId: number
): Promise<void> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()
		await prismaClient.spl_transfer.update({
			where: {
				spl_transfer_id: splTransferId
			},
			data: {
				secondary_market_transaction_id: secondaryMarketTransactionId
			}
		})
	} catch (error) {
		console.error(error)
		throw error
	}
}

export async function updateSplTransferRecordsWithTransactionId(
	splTransferIds: number[],
	secondaryMarketTransactionId: number
): Promise<void> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()
		for (const splTransferId of splTransferIds) {
			await prismaClient.spl_transfer.update({
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
