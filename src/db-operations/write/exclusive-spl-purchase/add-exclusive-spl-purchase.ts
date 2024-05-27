import PrismaClientClass from "../../../classes/prisma-client"

export default async function addExclusiveSplPurchase(
	splId: number,
	solanaWalletId: number,
	solTransferId: number
): Promise<void> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()
		await prismaClient.exclusive_spl_purchase.create({
			data: {
				spl_id: splId,
				solana_wallet_id: solanaWalletId,
				sol_transfer_id: solTransferId
			}
		})
	} catch (error) {
		console.error(error)
		throw error
	}
}
