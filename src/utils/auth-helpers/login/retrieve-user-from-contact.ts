import Encryptor from "../../../classes/encryptor"
import { findUserByWhereCondition } from "../../../db-operations/read/find/find-user"

export default async function retrieveUserFromContact(
	contact: string,
	contactType: EmailOrUsername
): Promise<ExtendedCredentials | null> {
	try {
		const whereCondition: { [key: string]: { equals: DeterministicEncryptedString | string, mode?: "insensitive"  } } = { }

		if (contactType === "Username") {
			whereCondition.username = { equals: contact, mode: "insensitive" }
		} else {
			const encryptor = new Encryptor()
			const encryptedEmail = await encryptor.deterministicEncrypt(contact, "EMAIL_ENCRYPTION_KEY")
			whereCondition.email__encrypted = { equals: encryptedEmail }
		}

		return await findUserByWhereCondition(whereCondition)
	} catch (error) {
		console.error(error)
		throw error
	}
}
