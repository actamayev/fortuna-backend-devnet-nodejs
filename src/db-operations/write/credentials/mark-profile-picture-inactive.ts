import PrismaClientClass from "../../../classes/prisma-client"

// TODO: Only retrieve active pfps and banners
export default async function markProfilePictureLinkInactive(userId: number): Promise<void> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()

		await prismaClient.credentials.update({
			where: {
				user_id: userId
			},
			data: {
				profile_picture: {
					update: {
						is_active: false
					}
				}
			}
		})
	} catch (error) {
		console.error(error)
		throw error
	}
}
