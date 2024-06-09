import _ from "lodash"

export default function transformVideoAndImageData(
	videoData: RetrievedHomePageVideosFromDB,
): VideoDataSendingToFrontendWithVideoUrl {
	const videoDataSendingToFrontEnd: VideoDataSendingToFrontendWithVideoUrl = {
		videoName: videoData.video_name,
		videoListingStatus: videoData.video_listing_status,
		description: videoData.description,
		imageUrl: videoData.uploaded_image.image_url,
		uuid: videoData.uuid,
		creatorUsername: videoData.video_creator_wallet.user.username,
		creatorProfilePictureUrl: videoData.video_creator_wallet.user.profile_picture?.image_url || null,
		isVideoExclusive: videoData.is_video_exclusive,
		createdAt: videoData.created_at,
		isUserAbleToAccessVideo: !_.isUndefined(videoData.videoUrl),
		numberOfExclusivePurchasesSoFar: videoData.numberOfExclusivePurchasesSoFar,
		tierData: videoData.video_access_tier.map(tier => ({
			tierNumber: tier.tier_number,
			purchasesInThisTier: tier.purchases_allowed_for_this_tier,
			tierDiscount: tier.percent_discount_at_this_tier,
			tierAccessPrice: tier.tier_access_price_usd,
			isTierSoldOut: tier.is_sold_out
		}))
	}

	if (!_.isUndefined(videoData.videoUrl)) {
		videoDataSendingToFrontEnd.videoUrl = videoData.videoUrl
	}

	return videoDataSendingToFrontEnd
}
