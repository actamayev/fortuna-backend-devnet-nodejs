import PrismaClientClass from "../../../classes/prisma-client"

export default async function retrieveProfilePictureUrlByUserId(userId: number): Promise<string | null> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()
		const profilePictureUrl = await prismaClient.profile_picture.findFirst({
			where: {
				user: {
					user_id: userId
				}
			},
			select: {
				image_url: true
			}
		})

		return profilePictureUrl?.image_url || null
	} catch (error) {
		console.error(error)
		throw error
	}
}
