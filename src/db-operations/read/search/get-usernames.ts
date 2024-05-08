import _ from "lodash"
import PrismaClientClass from "../../../classes/prisma-client"

export default async function getUsernames(
	username: string,
	excludeUsername: string | null
): Promise<{ username: string }[]> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()
		const usernames = await prismaClient.credentials.findMany({
			where: {
				username: {
					contains: username,
					mode: "insensitive",
					not: excludeUsername ? {
						equals: excludeUsername
					} : undefined
				}
			},
			select: {
				username: true
			}
		})

		const filteredUsernames = usernames.filter(user => !_.isNull(user.username)) as { username: string }[]
		return filteredUsernames
	} catch (error) {
		console.error(error)
		throw error
	}
}
