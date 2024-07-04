import _ from "lodash"
import PrismaClientClass from "../../../classes/prisma-client"

export default async function retrieveChannelName(userId: number): Promise<string | null> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()

		const channelName = await prismaClient.channel_name.findFirst({
			where: {
				user_id: userId
			},
			select: {
				channel_name: true
			}
		})

		if (_.isNull(channelName)) return null

		return channelName.channel_name
	} catch (error) {
		console.error(error)
		throw error
	}
}
