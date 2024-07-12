import PrismaClientClass from "../../../classes/prisma-client"

export default async function addUploadImageRecord (
	imageUploadUrl: string,
	fileName: string,
	videoId?: number
): Promise<number> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()

		const uploadImageResponse = await prismaClient.uploaded_image.create({
			data: {
				image_url: imageUploadUrl,
				file_name: fileName,
				video_id: videoId
			}
		})

		return uploadImageResponse.uploaded_image_id
	} catch (error) {
		console.error(error)
		throw error
	}
}
