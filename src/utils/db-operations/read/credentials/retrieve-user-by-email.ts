import { credentials } from "@prisma/client"
import PrismaClientClass from "../../../../classes/prisma-client"

export default async function retrieveUserByEmail(email: string): Promise<credentials | null> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()
		const user = await prismaClient.credentials.findFirst({
			where: {
				email: {
					equals: email,
					mode: "insensitive"
				}
			}
		})
		return user
	} catch (error) {
		console.error(error)
		throw error
	}
}
