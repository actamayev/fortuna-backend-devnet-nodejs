import PrismaClientClass from "../../../classes/prisma-client"

export default async function checkIfUserMadeExclusiveSplPurchase(splId: number, solanaWalletId: number): Promise<boolean> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()
		const exclusiveSplPurchase = await prismaClient.exclusive_spl_purchase.findFirst({
			where: {
				solana_wallet_id: solanaWalletId,
				spl_id: splId
			}
		})

		return exclusiveSplPurchase !== null
	} catch (error) {
		console.error("Error finding user:", error)
		throw error
	}
}
