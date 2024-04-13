import prismaClient from "../../../../prisma-client"

export default async function doesContactExist(contact: string, contactType: EmailOrPhone): Promise<boolean | void> {
	try {
		let exists
		if (contactType === "Email") exists = await doesEmailExist(contact)
		else exists = await doesPhoneExist(contact)

		return exists
	} catch (error) {
		console.error(error)
	}
}

async function doesEmailExist(email: string): Promise<boolean | void> {
	try {
		const user = await prismaClient.credentials.findFirst({
			where: {
				email: {
					equals: email,
					mode: "insensitive"
				}
			}
		})
		return user !== null
	} catch (error) {
		console.error(error)
	}
}

async function doesPhoneExist(phoneNumber: string): Promise<boolean | void> {
	try {
		const user = await prismaClient.credentials.findFirst({
			where: {
				phone_number: {
					equals: phoneNumber,
					mode: "insensitive"
				}
			}
		})

		return user !== null
	} catch (error) {
		console.error(error)
	}
}
