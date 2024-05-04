import { credentials } from "@prisma/client"
import prismaClient from "../../../../prisma-client"

export default async function retrieveUserByEmail(email: string): Promise<credentials | null> {
	try {
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
