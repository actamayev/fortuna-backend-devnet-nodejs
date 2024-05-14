import PrismaClientClass from "../../../../classes/prisma-client"

export async function updateSecondaryMarketAskSet(askId: number, newRemainingShareQuantity: number): Promise<void> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()
		await prismaClient.secondary_market_ask.update({
			where: {
				secondary_market_ask_id: askId
			},
			data: {
				remaining_number_of_shares_for_sale: newRemainingShareQuantity
			}
		})
	} catch (error) {
		console.error(error)
		throw error
	}
}

export async function updateSecondaryMarketAskDecrement(askId: number, sharesToDecrementBy: number): Promise<void> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()
		await prismaClient.secondary_market_ask.update({
			where: {
				secondary_market_ask_id: askId
			},
			data: {
				remaining_number_of_shares_for_sale: {
					decrement: sharesToDecrementBy
				}
			}
		})
	} catch (error) {
		console.error(error)
		throw error
	}
}
