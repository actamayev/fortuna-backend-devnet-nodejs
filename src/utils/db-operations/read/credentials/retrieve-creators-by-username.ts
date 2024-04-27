import prismaClient from "../../../../prisma-client"

export default async function retrieveCreatorsByUsername(usernameSearchTerm: string): Promise<RetrievedCreatorsByUsername[]> {
	try {
		const creatorData = await prismaClient.credentials.findMany({
			where: {
				username: {
					contains: usernameSearchTerm
				}
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

		return creatorData
	} catch (error) {
		console.error(error)
		throw error
	}
}
