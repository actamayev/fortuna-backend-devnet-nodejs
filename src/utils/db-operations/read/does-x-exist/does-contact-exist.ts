import prismaClient from "../../../../prisma-client"

export default async function doesContactExist(contact: string, contactType: EmailOrPhone): Promise<boolean> {
	try {
		let exists
		if (contactType === "Email") exists = await doesEmailExist(contact)
		else exists = await doesPhoneExist(contact)

		return exists
	} catch (error) {
		console.error(error)
		throw error
	}
}

async function doesEmailExist(email: string): Promise<boolean> {
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
		throw error
	}
}

async function doesPhoneExist(phoneNumber: string): Promise<boolean> {
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
		throw error
	}
}
