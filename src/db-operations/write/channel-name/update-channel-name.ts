import PrismaClientClass from "../../../classes/prisma-client"

export default async function updateChannelName(
	userId: number,
	channelName: string
): Promise<void> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()

		await prismaClient.channel_name.update({
			where: {
				user_id: userId
			},
			data: {
				channel_name: channelName
			}
		})
	} catch (error) {
		console.error(error)
		throw error
	}
}
