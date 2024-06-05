import PrismaClientClass from "../../../classes/prisma-client"

export default async function checkIfUserMadeExclusiveVideoPurchase(videoId: number, solanaWalletId: number): Promise<boolean> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()
		const exclusiveSplPurchase = await prismaClient.exclusive_video_access_purchase.findFirst({
			where: {
				solana_wallet_id: solanaWalletId,
				video_id: videoId
			}
		})

		return exclusiveSplPurchase !== null
	} catch (error) {
		console.error("Error finding user:", error)
		throw error
	}
}
