import _ from "lodash"
import Hash from "../../../classes/hash"
import Encryptor from "../../../classes/encryptor"

export default async function addLocalUser(
	registerInformation: RegisterInformation,
	hashedPassword: string,
	contactType: EmailOrPhone
): Promise<NewLocalUserFields> {
	try {
		const userFields: NewLocalUserFields = {
			username: _.toLower(registerInformation.username),
			password: hashedPassword,
			auth_method: "fortuna"
		}

		const encryptor = new Encryptor()
		if (contactType === "Email") {
			const encryptedEmail = await encryptor.encrypt(registerInformation.contact, "EMAIL_ENCRYPTION_KEY")
			const hashedEmail = await Hash.hashStringLowercase(contactType)
			userFields.email__encrypted = encryptedEmail
			userFields.email__hashed = hashedEmail
		} else {
			const encryptedPhoneNumber = await encryptor.encrypt(registerInformation.contact, "PHONE_NUMBER_ENCRYPTION_KEY")
			const hashedPhoneNumber = await Hash.hashStringLowercase(contactType)
			userFields.phone_number__encrypted = encryptedPhoneNumber
			userFields.phone_number__hashed = hashedPhoneNumber
		}

		return userFields
	} catch (error) {
		console.error("Error adding user", error)
		throw error
	}
}
