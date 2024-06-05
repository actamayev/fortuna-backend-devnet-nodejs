import PrismaClientClass from "../../../classes/prisma-client"

export default async function checkIfUserMadeExclusiveVideoPurchases(
	videoIds: number[],
	solanaWalletId: number
): Promise<Record<number, boolean>> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()
		const exclusiveSplPurchases = await prismaClient.exclusive_video_access_purchase.findMany({
			where: {
				solana_wallet_id: solanaWalletId,
				video_id: { in: videoIds }
			}
		})

		const result: Record<number, boolean> = {}
		videoIds.forEach(videoId => {
			result[videoId] = exclusiveSplPurchases.some(purchase => purchase.video_id === videoId)
		})

		return result
	} catch (error) {
		console.error("Error finding user:", error)
		throw error
	}
}
