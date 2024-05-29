import PrismaClientClass from "../../../classes/prisma-client"

export default async function checkIfUserMadeExclusiveSplPurchases(
	splIds: number[],
	solanaWalletId: number
): Promise<Record<number, boolean>> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()
		const exclusiveSplPurchases = await prismaClient.exclusive_spl_purchase.findMany({
			where: {
				solana_wallet_id: solanaWalletId,
				spl_id: { in: splIds }
			}
		})

		const result: Record<number, boolean> = {}
		splIds.forEach(splId => {
			result[splId] = exclusiveSplPurchases.some(purchase => purchase.spl_id === splId)
		})

		return result
	} catch (error) {
		console.error("Error finding user:", error)
		throw error
	}
}
