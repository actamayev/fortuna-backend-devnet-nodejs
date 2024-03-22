import { uploaded_image } from "@prisma/client"
import prismaClient from "../../prisma-client"

export default async function addUploadImageRecord (
	imageUploadUrl: string,
	fileName: string,
	uuid: string
): Promise<uploaded_image | void> {
	try {
		const uploadImageResponse = await prismaClient.uploaded_image.create({
			data: {
				image_url: imageUploadUrl,
				file_name: fileName,
				uuid
			}
		})

		return uploadImageResponse
	} catch (error) {
		console.error(error)
	}
}
