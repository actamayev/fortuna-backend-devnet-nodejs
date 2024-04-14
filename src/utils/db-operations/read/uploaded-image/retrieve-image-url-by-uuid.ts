import prismaClient from "../../../../prisma-client"

export default async function retrieveImageUrlByUUID(videoUUID: string): Promise<{ image_url: string } | null> {
	try {
		const retrievedImageUrl = await prismaClient.uploaded_image.findFirst({
			where: {
				uuid: videoUUID
			},
			select: {
				image_url: true
			}
		})

		return retrievedImageUrl
	} catch (error) {
		console.error(error)
		throw error
	}
}
