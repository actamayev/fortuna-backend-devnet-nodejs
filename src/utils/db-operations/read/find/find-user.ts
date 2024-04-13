import { credentials } from "@prisma/client"
import prismaClient from "../../../../prisma-client"

export async function findUserById(userId: number): Promise<credentials | null> {
	try {
		const user = await prismaClient.credentials.findUnique({
			where: { user_id: userId },
		})
		return user
	} catch (error) {
		console.error("Error finding user:", error)
		throw error
	}
}

export async function findUserByWhereCondition(
	whereCondition: { username: string } | { email: string } | { phone_number: string }
): Promise<credentials | null> {
	try {
		const user = await prismaClient.credentials.findFirst({
			where: whereCondition
		})
		return user
	} catch (error) {
		console.error("Error finding user:", error)
		throw error
	}
}
