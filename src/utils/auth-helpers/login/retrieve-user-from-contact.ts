import { Credentials } from "@prisma/client"
import prismaClient from "../../../prisma-client"

export default async function retrieveUserFromContact(
	contact: string, contactType: EmailOrPhoneOrUsername
): Promise<Credentials | null> {
	let whereCondition

	if (contactType === "Username") {
		whereCondition = { username: contact }
	} else if (contactType === "Email") {
		whereCondition = { email: contact }
	} else {
		whereCondition = { phone_number: contact }
	}

	const user = await prismaClient.credentials.findFirst({
		where: whereCondition,
	})

	return user
}
