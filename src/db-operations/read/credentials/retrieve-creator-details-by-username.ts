import PrismaClientClass from "../../../classes/prisma-client"

export default async function retrieveCreatorDetailsByUsername(creatorUsername: string): Promise<CreatorDetails | null> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()

		return await prismaClient.credentials.findUnique({
			where: {
				username: creatorUsername
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
				},
				social_platform_link: {
					select: {
						social_platform: true,
						social_link: true
					}
				}
			}
		})
	} catch (error) {
		console.error(error)
		throw error
	}
}
