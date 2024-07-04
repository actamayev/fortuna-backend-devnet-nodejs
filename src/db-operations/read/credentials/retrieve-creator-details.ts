import PrismaClientClass from "../../../classes/prisma-client"

export default async function retrieveCreatorDetails(userId: number): Promise<CreatorDetails | null> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()

		const creatorDetails = await prismaClient.credentials.findFirst({
			where: {
				user_id: userId
			},
			select: {
				channel_name: {
					select: {
						channel_name: true
					}
				},
				channel_description: {
					select: {
						channel_description: true
					}
				}
			}
		})

		return creatorDetails
	} catch (error) {
		console.error(error)
		throw error
	}
}
