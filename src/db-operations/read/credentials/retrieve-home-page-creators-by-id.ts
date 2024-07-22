import PrismaClientClass from "../../../classes/prisma-client"

// eslint-disable-next-line max-lines-per-function
export default async function retrieveHomePageCreatorsById(userIds: number[]): Promise<RetrievedHomePageCreators[]> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()

		const creatorData = await prismaClient.credentials.findMany({
			where: {
				user_id: { in: userIds },
				is_active: true
			},
			select: {
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

		// TODO: Confirm that the order of the creators is by the most-liked creators

		const filteredCreatorData: RetrievedHomePageCreators[] = creatorData.filter(user =>
			user.username !== null
		) as RetrievedHomePageCreators[]

		return filteredCreatorData
	} catch (error) {
		console.error(error)
		throw error
	}
}
