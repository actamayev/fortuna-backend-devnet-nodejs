import { blockchain_fees_paid_by_user } from "@prisma/client"
import PrismaClientClass from "../../../classes/prisma-client"
import SolPriceManager from "../../../classes/solana/sol-price-manager"

export default async function updateBlockchainFeesPaidByUser (
	blockchainFeesPaidByUserId: number,
	transferFeeSol: number
): Promise<blockchain_fees_paid_by_user> {
	try {
		const solPriceDetails = await SolPriceManager.getInstance().getPrice()
		const prismaClient = await PrismaClientClass.getPrismaClient()

		return await prismaClient.blockchain_fees_paid_by_user.update({
			where: {
				blockchain_fees_paid_by_user_id: blockchainFeesPaidByUserId
			},
			data: {
				fee_in_sol: transferFeeSol,
				fee_in_usd: transferFeeSol * solPriceDetails.price
			}
		})
	} catch (error) {
		console.error(error)
		throw error
	}
}
