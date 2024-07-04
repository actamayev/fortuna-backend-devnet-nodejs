import PrismaClientClass from "../../../classes/prisma-client"

export default async function upsertChannelDescription(
	userId: number,
	channelDescription: string
): Promise<void> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()

		await prismaClient.channel_description.upsert({
			where: {
				user_id: userId
			},
			update: {
				channel_description: channelDescription
			},
			create: {
				user_id: userId,
				channel_description: channelDescription
			}
		})
	} catch (error) {
		console.error(error)
		throw error
	}
}
