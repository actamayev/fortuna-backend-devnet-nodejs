import PrismaClientClass from "../../../classes/prisma-client"

export default async function markChannelBannerLinkInactive(userId: number): Promise<void> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()

		await prismaClient.channel_banner.update({
			where: {
				user_id: userId
			},
			data: {
				is_active: false
			}
		})
	} catch (error) {
		console.error(error)
		throw error
	}
}
