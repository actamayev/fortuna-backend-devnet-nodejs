import PrismaClientClass from "../../../classes/prisma-client"

export default async function upsertChannelName(
	userId: number,
	channelName: string
): Promise<void> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()

		await prismaClient.channel_name.upsert({
			where: {
				user_id: userId
			},
			update: {
				channel_name: channelName
			},
			create: {
				user_id: userId,
				channel_name: channelName
			}
		})
	} catch (error) {
		console.error(error)
		throw error
	}
}
