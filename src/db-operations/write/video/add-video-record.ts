/* eslint-disable max-lines-per-function */
import _ from "lodash"
import PrismaClientClass from "../../../classes/prisma-client"

export default async function addVideoRecord (
	newVideoData: IncomingNewVideoData,
	creatorUserId: number
): Promise<number> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()

		const addVideoResponse = await prismaClient.$transaction(async (prisma) => {
			const video = await prisma.video.create({
				data: {
					video_name: newVideoData.videoName,

					creator_user_id: creatorUserId,
					uploaded_image_id: newVideoData.uploadedImageId,
					uploaded_video_id: newVideoData.uploadedVideoId,

					uuid: newVideoData.uuid,

					is_video_exclusive: newVideoData.isContentExclusive,

					video_listing_status: "LISTED",
					description: newVideoData.description
				}
			})

			if (!_.isEmpty(newVideoData.tierData)) {
				const tierDataToInsert = newVideoData.tierData.map(singleTierData => ({
					video_id: video.video_id,
					tier_number: singleTierData.tierNumber,
					tier_access_price_usd: singleTierData.tierAccessPriceUsd,
					...(singleTierData.purchasesInThisTier !== null && {
						purchases_allowed_for_this_tier: singleTierData.purchasesInThisTier
					})
				}))

				await prisma.video_access_tier.createMany({
					data: tierDataToInsert
				})
			}

			await prisma.uploaded_image.update({
				where: {
					uploaded_image_id: newVideoData.uploadedImageId
				},
				data: {
					video_id: video.video_id
				}
			})

			await prisma.uploaded_video.update({
				where: {
					uploaded_video_id: newVideoData.uploadedVideoId
				},
				data: {
					video_id: video.video_id
				}
			})

			return video
		})

		return addVideoResponse.video_id
	} catch (error) {
		console.error(error)
		throw error
	}
}
