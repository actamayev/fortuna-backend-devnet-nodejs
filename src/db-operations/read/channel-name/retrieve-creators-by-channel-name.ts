import PrismaClientClass from "../../../classes/prisma-client"

// eslint-disable-next-line max-lines-per-function
export default async function retrieveCreatorsByChannelName(channelName: string): Promise<RetrievedCreatorsByUsername[]> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()

		const creatorData = await prismaClient.channel_name.findMany({
			where: {
				channel_name: {
					contains: channelName,
					mode: "insensitive"
				},
				user: {
					is_active: true
				}
			},
			select: {
				channel_name: true,
				user: {
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
					}
				}
			}
		})

		const filteredCreatorData: RetrievedCreatorsByUsername[] = creatorData.filter(user =>
			user.user.username !== null
		) as RetrievedCreatorsByUsername[]

		return filteredCreatorData
	} catch (error) {
		console.error(error)
		throw error
	}
}
