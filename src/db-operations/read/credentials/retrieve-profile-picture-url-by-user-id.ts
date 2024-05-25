import _ from "lodash"
import PrismaClientClass from "../../../classes/prisma-client"

export default async function retrieveProfilePictureUrlByUserId(userId: number): Promise<string | null> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()
		const profilePictureUrl = await prismaClient.credentials.findFirst({
			where: {
				user_id: userId
			},
			select: {
				profile_picture: {
					select: {
						image_url: true
					}
				}
			}
		})

		if (_.isNull(profilePictureUrl) || _.isNull(profilePictureUrl.profile_picture)) return null

		return profilePictureUrl.profile_picture.image_url
	} catch (error) {
		console.error(error)
		throw error
	}
}
