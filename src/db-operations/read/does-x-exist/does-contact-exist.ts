import PrismaClientClass from "../../../classes/prisma-client"

export default async function doesContactExist(hashedContact: HashedString, contactType: EmailOrPhone): Promise<boolean> {
	try {
		let exists: boolean
		if (contactType === "Email") exists = await doesEmailExist(hashedContact)
		else exists = await doesPhoneExist(hashedContact)

		return exists
	} catch (error) {
		console.error(error)
		throw error
	}
}

async function doesEmailExist(hashedEmail: HashedString): Promise<boolean> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()
		const user = await prismaClient.credentials.findFirst({
			where: {
				email__hashed: hashedEmail
			}
		})
		return user !== null
	} catch (error) {
		console.error(error)
		throw error
	}
}

async function doesPhoneExist(hashedPhoneNumber: HashedString): Promise<boolean> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()
		const user = await prismaClient.credentials.findFirst({
			where: {
				phone_number__hashed: hashedPhoneNumber
			}
		})
		return user !== null
	} catch (error) {
		console.error(error)
		throw error
	}
}
