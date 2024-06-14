import PrismaClientClass from "../../../classes/prisma-client"

export default async function doesContactExist(
	encryptedContact: DeterministicEncryptedString,
	contactType: EmailOrPhone
): Promise<boolean> {
	try {
		let exists: boolean
		if (contactType === "Email") exists = await doesEmailExist(encryptedContact)
		else exists = await doesPhoneExist(encryptedContact)

		return exists
	} catch (error) {
		console.error(error)
		throw error
	}
}

async function doesEmailExist(encryptedEmail: DeterministicEncryptedString): Promise<boolean> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()

		const user = await prismaClient.credentials.findFirst({
			where: {
				email__encrypted: encryptedEmail
			}
		})
		return user !== null
	} catch (error) {
		console.error(error)
		throw error
	}
}

async function doesPhoneExist(encryptedPhoneNumber: DeterministicEncryptedString): Promise<boolean> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()

		const user = await prismaClient.credentials.findFirst({
			where: {
				phone_number__encrypted: encryptedPhoneNumber
			}
		})
		return user !== null
	} catch (error) {
		console.error(error)
		throw error
	}
}
