import { Currencies } from "@prisma/client"
import PrismaClientClass from "../../../../classes/prisma-client"

export default async function setNewDefaultCurrency(userId: number, defaultCurrency: Currencies): Promise<void> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()
		await prismaClient.credentials.update({
			where: {
				user_id: userId
			},
			data: {
				default_currency: defaultCurrency
			}
		})
	} catch (error) {
		console.error(error)
		throw error
	}
}
