import { credentials } from "@prisma/client"
import prismaClient from "../../../../prisma-client"

export default async function addCredentialsRecord(userFields: NewLocalUserFields): Promise<credentials> {
	try {
		const user = await prismaClient.credentials.create({
			data: userFields
		})

		return user
	} catch (error) {
		console.error("Error adding credentials record:", error)
		throw error
	}
}
