import PrismaClientClass from "../../../classes/prisma-client"

export default async function addUploadVideoRecord (fileName: string): Promise<number> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()

		const uploadImageResponse = await prismaClient.uploaded_video.create({
			data: {
				file_name: fileName
			}
		})

		return uploadImageResponse.uploaded_video_id
	} catch (error) {
		console.error(error)
		throw error
	}
}
