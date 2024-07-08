import PrismaClientClass from "../../../classes/prisma-client"

export default async function upsertChannelName(
	userId: number,
	channelName: string
): Promise<void> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()

		// This is upsert, and not update, because in the begining, the channel name wasn't created upon account creation.
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
