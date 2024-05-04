import { credentials } from "@prisma/client"
import { findUserByWhereCondition } from "../../db-operations/read/find/find-user"

export default async function retrieveUserFromContact(
	contact: string,
	contactType: EmailOrPhoneOrUsername
): Promise<credentials | null> {
	try {
		const whereCondition: { [key: string]: unknown } = { }
		const searchMode = { mode: "insensitive" }

		if (contactType === "Username") {
			whereCondition.username = { ...searchMode, equals: contact }
		} else if (contactType === "Email") {
			whereCondition.email = { ...searchMode, equals: contact }
		} else {
			whereCondition.phone_number = { ...searchMode, equals: contact }
		}

		const user = await findUserByWhereCondition(whereCondition)

		return user
	} catch (error) {
		console.error(error)
		throw error
	}
}
