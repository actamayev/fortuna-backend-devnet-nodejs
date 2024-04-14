export function addLocalUser(
	registerInformation: RegisterInformation,
	hashedPassword: string,
	contactType: EmailOrPhone
): NewLocalUserFields {
	try {
		const userFields: NewLocalUserFields = {
			username: registerInformation.username,
			password: hashedPassword,
		}

		if (contactType === "Email") {
			userFields.email = registerInformation.contact
		} else {
			userFields.phone_number = registerInformation.contact
		}

		return userFields
	} catch (error) {
		console.error("Error adding user", error)
		throw error
	}
}
