import _ from "lodash"

export default function transformVideoAndImageData(
	videoData: RetrievedHomePageVideosFromDB,
): VideoDataSendingToFrontendWithVideoUrl {
	const videoDataSendingToFrontEnd: VideoDataSendingToFrontendWithVideoUrl = {
		videoName: videoData.video_name,
		listingPriceToAccessUsd: videoData.listing_price_to_access_usd,
		videoListingStatus: videoData.video_listing_status,
		description: videoData.description,
		imageUrl: videoData.uploaded_image.image_url,
		uuid: videoData.uuid,
		originalContentUrl: videoData.original_content_url,
		creatorUsername: videoData.video_creator_wallet.user.username,
		creatorProfilePictureUrl: videoData.video_creator_wallet.user.profile_picture?.image_url || null,
		isVideoExclusive: videoData.is_video_exclusive,
		isUserAbleToAccessVideo: !_.isUndefined(videoData.videoUrl)
	}

	if (!_.isUndefined(videoData.videoUrl)) {
		videoDataSendingToFrontEnd.videoUrl = videoData.videoUrl
	}

	return videoDataSendingToFrontEnd
}
