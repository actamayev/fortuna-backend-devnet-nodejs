import _ from "lodash"
import PrismaClientClass from "../../../classes/prisma-client"

export default async function retrieveCreatorDetailsByUsername(creatorUsername: string): Promise<CreatorDetails | null> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()

		const creatorDetails = await prismaClient.credentials.findFirst({
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
				}
			}
		})

		if (_.isNull(creatorDetails)) return null

		return creatorDetails
	} catch (error) {
		console.error(error)
		throw error
	}
}
