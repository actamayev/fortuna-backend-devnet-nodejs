import PrismaClientClass from "../../../../classes/prisma-client"

export default async function cancelSecondaryMarketAsk(askId: number): Promise<void> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()
		await prismaClient.secondary_market_ask.update({
			where: {
				secondary_market_ask_id: askId
			},
			data: {
				is_active: false
			}
		})
	} catch (error) {
		console.error(error)
		throw error
	}
}
