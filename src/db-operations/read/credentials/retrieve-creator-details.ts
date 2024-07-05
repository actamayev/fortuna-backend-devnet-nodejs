import PrismaClientClass from "../../../classes/prisma-client"

export default async function retrieveCreatorDetails(userId: number): Promise<CreatorDetails | null> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()

		return await prismaClient.credentials.findUnique({
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
				},
				social_platform_link: {
					select: {
						social_platform: true,
						social_link: true
					},
					where: {
						is_active: true
					}
				}
			}
		})
	} catch (error) {
		console.error(error)
		throw error
	}
}
