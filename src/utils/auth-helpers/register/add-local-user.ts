import Encryptor from "../../../classes/encryptor"

export default async function addLocalUser(
	registerInformation: RegisterInformation,
	hashedPassword: HashedString,
	contactType: EmailOrPhone
): Promise<NewLocalUserFields> {
	try {
		const userFields: NewLocalUserFields = {
			username: registerInformation.username,
			password: hashedPassword,
			auth_method: "fortuna",
			default_site_theme: registerInformation.siteTheme
		}

		const encryptor = new Encryptor()
		if (contactType === "Email") {
			const encryptedEmail = await encryptor.deterministicEncrypt(registerInformation.contact, "EMAIL_ENCRYPTION_KEY")
			userFields.email__encrypted = encryptedEmail
		} else {
			const encryptedPhoneNumber = await encryptor.deterministicEncrypt(registerInformation.contact, "PHONE_NUMBER_ENCRYPTION_KEY")
			userFields.phone_number__encrypted = encryptedPhoneNumber
		}

		return userFields
	} catch (error) {
		console.error("Error adding user", error)
		throw error
	}
}
