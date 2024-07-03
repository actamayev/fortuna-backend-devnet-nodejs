import PrismaClientClass from "../../../classes/prisma-client"
import SolPriceManager from "../../../classes/sol-price-manager"

export default async function updateBlockchainFeesPaidByFortuna (
	blockchainFeesPaidByFortunaId: number,
	transferFeeSol: number
): Promise<void> {
	try {
		const solPriceDetails = await SolPriceManager.getInstance().getPrice()
		const prismaClient = await PrismaClientClass.getPrismaClient()

		await prismaClient.blockchain_fees_paid_by_fortuna.update({
			where: {
				blockchain_fees_paid_by_fortuna_id: blockchainFeesPaidByFortunaId
			},
			data: {
				fee_in_sol: transferFeeSol,
				fee_in_usd: transferFeeSol * solPriceDetails.price,
			}
		})
	} catch (error) {
		console.error(error)
		throw error
	}
}
