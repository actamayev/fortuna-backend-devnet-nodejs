import PrismaClientClass from "../../../classes/prisma-client"

export default async function retrieveCreatorsByUsername(username: string): Promise<RetrievedCreatorsByUsername[]> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()
		const creatorData = await prismaClient.credentials.findMany({
			where: {
				username: {
					contains: username,
					mode: "insensitive",
					notIn: ["fortunaEscrow", "fortunaBoss"]
				},
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
