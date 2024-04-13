import { credentials } from "@prisma/client"
import { findUserByWhereCondition } from "../../db-operations/read/find/find-user"

export default async function retrieveUserFromContact(
	contact: string,
	contactType: EmailOrPhoneOrUsername
): Promise<credentials | null> {
	try {
		let whereCondition

		if (contactType === "Username") {
			whereCondition = { username: contact }
		} else if (contactType === "Email") {
			whereCondition = { email: contact }
		} else {
			whereCondition = { phone_number: contact }
		}

		const user = await findUserByWhereCondition(whereCondition)

		return user
	} catch (error) {
		console.error(error)
		throw error
	}
}
