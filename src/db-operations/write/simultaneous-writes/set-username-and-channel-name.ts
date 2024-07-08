import PrismaClientClass from "../../../classes/prisma-client"

export default async function setUsernameAndChannelName(userId: number, username: string): Promise<void> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()

		await prismaClient.$transaction(async (prisma) => {
			await prismaClient.credentials.update({
				where: {
					user_id: userId
				},
				data: {
					username
				}
			})

			await prisma.channel_name.create({
				data: {
					user_id: userId,
					channel_name: username
				}
			})
		})
	} catch (error) {
		console.error(error)
		throw error
	}
}
