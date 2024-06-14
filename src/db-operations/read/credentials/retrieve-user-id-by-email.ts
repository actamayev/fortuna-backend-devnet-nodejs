import _ from "lodash"
import PrismaClientClass from "../../../classes/prisma-client"

export default async function retrieveUserIdByEmail(encryptedEmail: DeterministicEncryptedString): Promise<number | null> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()

		const user = await prismaClient.credentials.findFirst({
			select: {
				user_id: true
			},
			where: {
				email__encrypted: {
					equals: encryptedEmail
				}
			}
		})

		if (_.isNull(user)) return null
		return user.user_id
	} catch (error) {
		console.error(error)
		throw error
	}
}
