import _ from "lodash"
import PrismaClientClass from "../../../classes/prisma-client"

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

		if (!_.isEmpty(newVideoData.tierData)) {
			const tierDataToInsert = newVideoData.tierData.map(singleTierData => ({
				video_id: addVideoResponse.video_id,
				tier_number: singleTierData.tierNumber,
				purchases_allowed_for_this_tier: singleTierData.purchasesInThisTier,
				percent_discount_at_this_tier: singleTierData.tierDiscount
			}))

			await prismaClient.video_access_tier.createMany({
				data: tierDataToInsert
			})
		}

		return addVideoResponse.video_id
	} catch (error) {
		console.error(error)
		throw error
	}
}
