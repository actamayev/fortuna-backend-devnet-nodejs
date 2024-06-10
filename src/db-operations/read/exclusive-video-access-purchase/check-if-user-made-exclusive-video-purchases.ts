import PrismaClientClass from "../../../classes/prisma-client"

export default async function checkIfUserMadeExclusiveVideoPurchases(
	videoIds: number[],
	solanaWalletId: number
): Promise<Record<number, boolean>> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()
		const exclusiveVideoPurchase = await prismaClient.exclusive_video_access_purchase.findMany({
			where: {
				solana_wallet_id: solanaWalletId,
				video_id: { in: videoIds }
			}
		})

		const result: Record<number, boolean> = {}
		videoIds.forEach(videoId => {
			result[videoId] = exclusiveVideoPurchase.some(purchase => purchase.video_id === videoId)
		})

		return result
	} catch (error) {
		console.error("Error checking if the user made exclusive video purchases:", error)
		throw error
	}
}
