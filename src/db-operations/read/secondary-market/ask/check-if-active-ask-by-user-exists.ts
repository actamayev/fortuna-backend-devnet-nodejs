import { secondary_market_ask } from "@prisma/client"
import PrismaClientClass from "../../../../classes/prisma-client"

export default async function checkIfActiveAskByUserExists(askId: number): Promise<secondary_market_ask | null> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()
		const ask = await prismaClient.secondary_market_ask.findFirst({
			where: {
				is_active: true,
				secondary_market_ask_id: askId
			}
		})

		return ask
	} catch (error) {
		console.error(error)
		throw error
	}
}
