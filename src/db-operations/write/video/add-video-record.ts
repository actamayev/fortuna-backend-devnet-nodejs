import PrismaClientClass from "../../../classes/prisma-client"

// eslint-disable-next-line max-lines-per-function
export default async function addVideoRecord (
	newVideoData: IncomingNewVideoData,
	creatorWalletId: number
): Promise<number> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()

		const addVideoResponse = await prismaClient.video.create({
			data: {
				video_name: newVideoData.videoName,
				listing_price_to_access_usd: newVideoData.listingPriceToAccessUsd,

				creator_wallet_id: creatorWalletId,
				uploaded_image_id: newVideoData.uploadedImageId,
				uploaded_video_id: newVideoData.uploadedVideoId,
				original_content_url: newVideoData.originalContentUrl,

				uuid: newVideoData.uuid,

				is_video_exclusive: newVideoData.isContentExclusive,

				video_listing_status: "LISTED",
				description: newVideoData.description
			}
		})

		return addVideoResponse.video_id
	} catch (error) {
		console.error(error)
		throw error
	}
}
