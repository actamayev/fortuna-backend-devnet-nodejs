import { credentials } from "@prisma/client"
import PrismaClientClass from "../../../../classes/prisma-client"

export async function findUserById(userId: number): Promise<credentials | null> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()
		const user = await prismaClient.credentials.findUnique({
			where: { user_id: userId },
		})
		return user
	} catch (error) {
		console.error("Error finding user by Id:", error)
		throw error
	}
}

export async function findUserByWhereCondition(
	whereCondition:
		{ username?: { equals: string, mode: "insensitive" } } |
		{ email?: { equals: string, mode: "insensitive" } } |
		{ phone_number?: { equals: string, mode: "insensitive" } }
): Promise<credentials | null> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()
		const user = await prismaClient.credentials.findFirst({
			where: whereCondition
		})
		return user
	} catch (error) {
		console.error("Error finding user:", error)
		throw error
	}
}
