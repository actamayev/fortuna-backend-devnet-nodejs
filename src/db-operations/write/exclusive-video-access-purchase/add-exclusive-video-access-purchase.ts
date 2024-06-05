import PrismaClientClass from "../../../classes/prisma-client"

export default async function addExclusiveVideoAcceslPurchase(
	videoId: number,
	solanaWalletId: number,
	solTransferId: number
): Promise<void> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()
		await prismaClient.exclusive_video_access_purchase.create({
			data: {
				video_id: videoId,
				solana_wallet_id: solanaWalletId,
				sol_transfer_id: solTransferId
			}
		})
	} catch (error) {
		console.error(error)
		throw error
	}
}
