import Encryptor from "../../../classes/encryptor"
import { findUserByWhereCondition } from "../../../db-operations/read/find/find-user"

export default async function retrieveUserFromContact(
	contact: string,
	contactType: EmailOrPhoneOrUsername
): Promise<ExtendedCredentials | null> {
	try {
		const whereCondition: { [key: string]: { equals: HashedString | string, mode?: "insensitive"  } } = { }

		if (contactType === "Username") {
			whereCondition.username = { equals: contact, mode: "insensitive" }
		} else {
			const encryptor = new Encryptor()
			if (contactType === "Email") {
				const encryptedEmail = await encryptor.deterministicEncrypt(contact, "EMAIL_ENCRYPTION_KEY")
				whereCondition.email__encrypted = { equals: encryptedEmail }
			} else {
				const encryptedPhoneNumber = await encryptor.deterministicEncrypt(contact, "PHONE_NUMBER_ENCRYPTION_KEY")
				whereCondition.phone_number__encrypted = { equals: encryptedPhoneNumber }
			}
		}

		const user = await findUserByWhereCondition(whereCondition)

		return user
	} catch (error) {
		console.error(error)
		throw error
	}
}
