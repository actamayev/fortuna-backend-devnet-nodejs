import PrismaClientClass from "../../../classes/prisma-client"

// eslint-disable-next-line max-lines-per-function
export default async function retrieveHomePageCreatorsByIds(userIds: number[]): Promise<RetrievedHomePageCreators[]> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()

		const creatorData = await prismaClient.credentials.findMany({
			where: {
				user_id: { in: userIds },
				is_active: true
			},
			select: {
				user_id: true,
				username: true,
				profile_picture: {
					select: {
						image_url: true
					},
					where: {
						is_active: true
					}
				},
				channel_banner: {
					select: {
						image_url: true
					},
					where: {
						is_active: true
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
				},
				channel_name: {
					select: {
						channel_name: true
					}
				},
				_count: {
					select: {
						video: {
							where: {
								video_listing_status: {
									not: "UNLISTED"
								}
							}
						}
					}
				}
			},
			take: 4
		})

		const orderedCreatorData = userIds.map(userId => {
			return creatorData.find(user => user.user_id === userId)
		}).filter(user => user !== undefined) as RetrievedHomePageCreators[]

		return orderedCreatorData
	} catch (error) {
		console.error(error)
		throw error
	}
}
