import Hash from "../../../classes/hash"
import { findUserByWhereCondition } from "../../../db-operations/read/find/find-user"

export default async function retrieveUserFromContact(
	contact: string,
	contactType: EmailOrPhoneOrUsername
): Promise<ExtendedCredentials | null> {
	try {
		const whereCondition: { [key: string]: { equals: HashedString  | string, mode?: "insensitive"  } } = { }

		if (contactType === "Username") {
			whereCondition.username = { equals: contact, mode: "insensitive" }
		} else if (contactType === "Email") {
			const hashedEmail = await Hash.hashStringLowercase(contact)
			whereCondition.email__hashed = { equals: hashedEmail }
		} else {
			const hashedPhoneNumber = await Hash.hashStringLowercase(contact)
			whereCondition.phone_number__hashed = { equals: hashedPhoneNumber }
		}

		const user = await findUserByWhereCondition(whereCondition)

		return user
	} catch (error) {
		console.error(error)
		throw error
	}
}
