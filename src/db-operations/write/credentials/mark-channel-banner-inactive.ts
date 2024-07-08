import PrismaClientClass from "../../../classes/prisma-client"

export default async function markChannelBannerLinkInactive(userId: number): Promise<void> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()

		await prismaClient.credentials.update({
			where: {
				user_id: userId
			},
			data: {
				channel_banner: {
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
