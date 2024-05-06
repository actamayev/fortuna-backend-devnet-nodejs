import prismaClient from "../../../../../classes/prisma-client"

export default async function addSplPurchaseRecord(
	splId: number,
	splTransferId: number,
	solTransferId: number
): Promise<void> {
	try {
		await prismaClient.spl_purchase.create({
			data: {
				spl_id: splId,
				spl_transfer_id: splTransferId,
				sol_transfer_id: solTransferId
			}
		})
	} catch (error) {
		console.error(error)
		throw error
	}
}
