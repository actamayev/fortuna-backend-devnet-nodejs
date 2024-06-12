import PrismaClientClass from "../../../classes/prisma-client"

export default async function addExclusiveVideoAccessPurchase(
	videoId: number,
	solanaWalletId: number,
	tierNumber: number,
	exclusiveVideoAccessPurchaseSolTransferId: number,
	exclusiveVideoAccessPurchaseFortunaTakeId: number
): Promise<void> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()
		await prismaClient.exclusive_video_access_purchase.create({
			data: {
				video_id: videoId,
				solana_wallet_id: solanaWalletId,
				video_access_tier_number: tierNumber,
				exclusive_video_access_purchase_sol_transfer_id: exclusiveVideoAccessPurchaseSolTransferId,
				exclusive_video_access_purchase_fortuna_take_id: exclusiveVideoAccessPurchaseFortunaTakeId
			}
		})
	} catch (error) {
		console.error(error)
		throw error
	}
}
