import prismaClient from "../../../prisma-client"

export default async function addUploadVideoRecord (
	videoUploadUrl: string,
	fileName: string,
	uuid: string
): Promise<number | void> {
	try {
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
	}
}
