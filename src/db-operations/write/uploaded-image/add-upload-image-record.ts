import PrismaClientClass from "../../../classes/prisma-client"

export default async function addUploadImageRecord (imageUploadUrl: string, fileName: string): Promise<number> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()
		const uploadImageResponse = await prismaClient.uploaded_image.create({
			data: {
				image_url: imageUploadUrl,
				file_name: fileName
			}
		})

		return uploadImageResponse.uploaded_image_id
	} catch (error) {
		console.error(error)
		throw error
	}
}
