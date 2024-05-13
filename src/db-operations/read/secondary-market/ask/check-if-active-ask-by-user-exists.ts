import PrismaClientClass from "../../../../classes/prisma-client"

export default async function checkIfActiveAskByUserExists(askId: number, userId: number): Promise<boolean> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()
		const ask = await prismaClient.secondary_market_ask.findFirst({
			where: {
				is_active: true,
				secondary_market_ask_id: askId,
				solana_wallet: {
					user_id: userId
				}
			}
		})

		return ask !== null
	} catch (error) {
		console.error(error)
		throw error
	}
}
