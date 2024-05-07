import PrismaClientClass from "../../../classes/prisma-client"

export default async function retrieveUserIdByEmail(hashedEmail: HashedString): Promise<number | null> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()
		const user = await prismaClient.credentials.findFirst({
			where: {
				email__hashed: {
					equals: hashedEmail
				}
			}
		})
		return user?.user_id || null
	} catch (error) {
		console.error(error)
		throw error
	}
}
