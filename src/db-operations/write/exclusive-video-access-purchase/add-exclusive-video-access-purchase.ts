import PrismaClientClass from "../../../classes/prisma-client"

export default async function addExclusiveVideoAccessPurchase(
	videoId: number,
	solanaWalletId: number,
	solTransferId: number,
	tierNumber: number
): Promise<number> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()
		const exclusiveVideoAccessPurchase = await prismaClient.exclusive_video_access_purchase.create({
			data: {
				video_id: videoId,
				solana_wallet_id: solanaWalletId,
				sol_transfer_id: solTransferId,
				video_access_tier_number: tierNumber
			}
		})

		return exclusiveVideoAccessPurchase.exclusive_video_access_purchase_id
	} catch (error) {
		console.error(error)
		throw error
	}
}
