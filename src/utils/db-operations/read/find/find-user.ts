import { credentials } from "@prisma/client"
import prismaClient from "../../../../prisma-client"

export default async function findUserById(userId: number): Promise<credentials | null | void> {
	try {
		const user = await prismaClient.credentials.findUnique({
			where: { user_id: userId },
		})
		return user
	} catch (error) {
		console.error("Error finding user:", error)
	}
}
