import { Credentials } from "@prisma/client"
import prismaClient from "../../prisma-client"

export default async function findUser(userId: number): Promise<Credentials | null> {
	try {
		const user = await prismaClient.credentials.findUnique({
			where: { user_id: userId },
		})
		return user
	} catch (error) {
		console.error("Error finding user:", error)
		return null
	}

}
