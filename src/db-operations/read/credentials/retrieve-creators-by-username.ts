import PrismaClientClass from "../../../classes/prisma-client"

// eslint-disable-next-line max-lines-per-function
export default async function retrieveCreatorsByUsername(username: string): Promise<RetrievedCreatorsByUsername[]> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()

		const creatorData = await prismaClient.credentials.findMany({
			where: {
				username: {
					contains: username,
					mode: "insensitive",
					notIn: ["fortunaBoss"]
				},
			},
			select: {
				username: true,
				profile_picture: {
					select: {
						image_url: true
					}
				},
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

		const filteredCreatorData: RetrievedCreatorsByUsername[] = creatorData.filter(user =>
			user.username !== null
		) as RetrievedCreatorsByUsername[]

		return filteredCreatorData
	} catch (error) {
		console.error(error)
		throw error
	}
}
