import PrismaClientClass from "../../../classes/prisma-client"

export default async function updateVideoThumbnailId(videoId: number, uploadedImageId: number): Promise<void> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()

		await prismaClient.video.update({
			where: {
				video_id: videoId
			},
			data: {
				uploaded_image_id: uploadedImageId
			}
		})
	} catch (error) {
		console.error(error)
		throw error
	}
}
