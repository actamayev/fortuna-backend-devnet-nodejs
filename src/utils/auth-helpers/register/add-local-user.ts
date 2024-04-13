import addCredentialsRecord from "../../db-operations/write/credentials/add-credentials-record"

export async function addLocalUser(
	registerInformation: RegisterInformation,
	hashedPassword: string,
	contactType: EmailOrPhone
): Promise<number> {
	try {
		const userFields: NewLocalUserFields = {
			username: registerInformation.username,
			password: hashedPassword,
			is_active: true,
		}

		if (contactType === "Email") {
			userFields.email = registerInformation.contact
		} else {
			userFields.phone_number = registerInformation.contact
		}

		const user = await addCredentialsRecord(userFields)

		return user.user_id
	} catch (error) {
		console.error("Error adding user", error)
		throw error
	}
}
