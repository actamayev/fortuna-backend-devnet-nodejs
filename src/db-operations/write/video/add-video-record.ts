/* eslint-disable max-lines-per-function */
import _ from "lodash"
import PrismaClientClass from "../../../classes/prisma-client"
import addVideoTags from "../video-tag-mapping/add-video-tags"
import retrieveOrCreateNewVideoTags from "../video-tag-lookup/retrieve-or-create-new-video-tags"

interface ReturningVideoRecord {
	newVideoId: number
	videoTags: VideoTags[]
}

export default async function addVideoRecord (
	newVideoData: IncomingNewVideoData,
	creatorUserId: number
): Promise<ReturningVideoRecord> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()

		return await prismaClient.$transaction(async (prisma) => {
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

			let videoTags: VideoTags[] = []

			if (!_.isEmpty(newVideoData.videoTags)) {
				videoTags = await retrieveOrCreateNewVideoTags(newVideoData.videoTags, creatorUserId)
				const videoLookupTagIds = videoTags.map(videoTag => videoTag.videoTagId)
				await addVideoTags(videoLookupTagIds, video.video_id)
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

			return { newVideoId: video.video_id, videoTags }
		})
	} catch (error) {
		console.error(error)
		throw error
	}
}
