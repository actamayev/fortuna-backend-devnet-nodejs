import prismaClient from "../../../../classes/prisma-client"

export default async function addUploadImageRecord (
	imageUploadUrl: string,
	fileName: string,
	uuid: string
): Promise<number> {
	try {
		const uploadImageResponse = await prismaClient.uploaded_image.create({
			data: {
				image_url: imageUploadUrl,
				file_name: fileName,
				uuid
			}
		})

		return uploadImageResponse.uploaded_image_id
	} catch (error) {
		console.error(error)
		throw error
	}
}
