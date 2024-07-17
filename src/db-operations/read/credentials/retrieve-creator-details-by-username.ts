import PrismaClientClass from "../../../classes/prisma-client"

// eslint-disable-next-line max-lines-per-function
export default async function retrieveCreatorDetailsByUsername(creatorUsername: string): Promise<CreatorDetails | null> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()

		return await prismaClient.credentials.findUnique({
			where: {
				username: creatorUsername,
				is_active: true
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
				channel_banner: {
					select: {
						image_url:  true
					},
					where: {
						is_active: true
					}
				},
				profile_picture: {
					select: {
						image_url: true
					},
					where: {
						is_active: true
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
