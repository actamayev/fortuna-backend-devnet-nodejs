import PrismaClientClass from "../../../classes/prisma-client"

export default async function addChannelBannerPicture (
	imageUploadUrl: string,
	fileName: string,
	uuid: string,
	userId: number
): Promise<void> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()

		await prismaClient.$transaction(async (prisma) => {
			const channelBanner = await prisma.channel_banner.create({
				data: {
					image_url: imageUploadUrl,
					file_name: fileName,
					uuid
				}
			})

			await prisma.credentials.update({
				where: {
					user_id: userId
				},
				data: {
					channel_banner_id: channelBanner.channel_banner_id
				}
			})
		})
	} catch (error) {
		console.error(error)
		throw error
	}
}
