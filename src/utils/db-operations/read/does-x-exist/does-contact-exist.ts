import prismaClient from "../../../../prisma-client"

export default async function doesContactExist(contact: string, contactType: EmailOrPhone): Promise<boolean> {
	let exists: boolean
	if (contactType === "Email") exists = await doesEmailExist(contact)
	else exists = await doesPhoneExist(contact)

	return exists
}

async function doesEmailExist(email: string): Promise<boolean> {
	const user = await prismaClient.credentials.findFirst({
		where: {
			email: {
				equals: email,
				mode: "insensitive"
			},
		},
	})
	return user !== null
}

async function doesPhoneExist(phoneNumber: string): Promise<boolean> {
	const user = await prismaClient.credentials.findFirst({
		where: {
			phone_number: {
				equals: phoneNumber,
				mode: "insensitive"
			},
		},
	})
	return user !== null
}
