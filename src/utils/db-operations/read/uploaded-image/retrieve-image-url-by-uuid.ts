import prismaClient from "../../../../prisma-client"

export default async function retrieveImageUrlByUUID(videoUUID: string): Promise<string | null> {
	try {
		const retrievedImageUrl = await prismaClient.uploaded_image.findFirst({
			where: {
				uuid: videoUUID
			},
			select: {
				image_url: true
			}
		})

		return retrievedImageUrl?.image_url || null
	} catch (error) {
		console.error(error)
		throw error
	}
}
