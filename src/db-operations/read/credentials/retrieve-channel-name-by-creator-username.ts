import _ from "lodash"
import PrismaClientClass from "../../../classes/prisma-client"

export default async function retrieveChannelNameByCreatorUsername(creatorUsername: string): Promise<string | null> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()

		const user = await prismaClient.credentials.findFirst({
			where: {
				username: creatorUsername
			},
			select: {
				channel_name: true
			}
		})

		if (_.isNull(user) || _.isNull(user.channel_name)) return null

		return user.channel_name.channel_name
	} catch (error) {
		console.error(error)
		throw error
	}
}
