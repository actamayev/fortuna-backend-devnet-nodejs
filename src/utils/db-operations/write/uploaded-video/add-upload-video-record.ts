import PrismaClientClass from "../../../../classes/prisma-client"

export default async function addUploadVideoRecord (
	videoUploadUrl: string,
	fileName: string,
	uuid: string
): Promise<number> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()
		const uploadImageResponse = await prismaClient.uploaded_video.create({
			data: {
				video_url: videoUploadUrl,
				file_name: fileName,
				uuid
			}
		})

		return uploadImageResponse.uploaded_video_id
	} catch (error) {
		console.error(error)
		throw error
	}
}
