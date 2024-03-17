import prismaClient from "../../../prisma-client"

export async function addLocalUser(
	registerInformation: RegisterInformation,
	hashedPassword: string,
	contactType: EmailOrPhone
): Promise<number | undefined> {
	try {
		const userFields: NewLocalUserFields = {
			username: registerInformation.username,
			password: hashedPassword,
			is_active: true,
		}

		if (contactType === "Email") {
			userFields.email = registerInformation.contact
		} else {
			userFields.phoneNumber = registerInformation.contact
		}

		const user = await prismaClient.credentials.create({
			data: userFields
		})

		return user.user_id
	} catch (error) {
		console.error("Error adding user", error)
	}
}
