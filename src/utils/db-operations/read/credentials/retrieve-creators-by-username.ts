import prismaClient from "../../../../prisma-client"

export default async function retrieveCreatorsByUsername(usernameSearchTerm: string): Promise<RetrievedCreatorsByUsername[]> {
	try {
		const creatorData = await prismaClient.credentials.findMany({
			where: {
				username: {
					contains: usernameSearchTerm,
					mode: "insensitive"
				},
				is_approved_to_be_creator: true
			},
			select: {
				username: true,
				profile_picture: {
					select: {
						image_url: true
					}
				}
			}
		})

		const filteredCreatorData: RetrievedCreatorsByUsername[] = creatorData.filter(user =>
			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
			user.username !== null
		) as RetrievedCreatorsByUsername[]

		return filteredCreatorData
	} catch (error) {
		console.error(error)
		throw error
	}
}
