import _ from "lodash"

// eslint-disable-next-line max-lines-per-function
export default function transformVideoByUUIDData(
	videoData: RetrievedHomePageVideosFromDB,
	userId: number | undefined
): VideoDataSendingToFrontendWithVideoUrl {
	try {
		let numberOfLikes = 0
		let userLikeStatus: boolean = false
		videoData.video_like_status.map(videoLikeStatus => {
			numberOfLikes ++
			if (videoLikeStatus.user_id === userId) userLikeStatus = true
		})
		const videoDataSendingToFrontEnd: VideoDataSendingToFrontendWithVideoUrl = {
			videoName: videoData.video_name,
			videoListingStatus: videoData.video_listing_status,
			description: videoData.description,
			imageUrl: videoData.uploaded_image.image_url,
			uuid: videoData.uuid,
			creatorUsername: videoData.video_creator.username,
			creatorProfilePictureUrl: videoData.video_creator.profile_picture?.image_url || null,
			channelBannerPictureUrl: videoData.video_creator.channel_banner?.image_url || null,
			isVideoExclusive: videoData.is_video_exclusive,
			createdAt: videoData.created_at,
			isUserAbleToAccessVideo: !_.isUndefined(videoData.videoUrl),
			numberOfExclusivePurchasesSoFar: videoData.numberOfExclusivePurchasesSoFar,
			tierData: videoData.video_access_tier.map(tier => ({
				tierNumber: tier.tier_number,
				purchasesInThisTier: tier.purchases_allowed_for_this_tier,
				tierAccessPriceUsd: tier.tier_access_price_usd,
				isTierSoldOut: tier.is_sold_out
			})),
			numberOfLikes,
			userLikeStatus,
			channelName: videoData.video_creator.channel_name?.channel_name || videoData.video_creator.username
		}

		if (!_.isUndefined(videoData.videoUrl)) {
			videoDataSendingToFrontEnd.videoUrl = videoData.videoUrl
		}

		return videoDataSendingToFrontEnd
	} catch (error) {
		console.error(error)
		throw error
	}
}
