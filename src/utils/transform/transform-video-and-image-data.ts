import _ from "lodash"

export default function transformVideoAndImageData(
	videoData: HomePageVideoRetrievedFromDBByUUID,
	sharesRemainingForSale: number
): VideoDataSendingToFrontendWithVideoUrl {
	const videoDataSendingToFrontEnd: VideoDataSendingToFrontendWithVideoUrl = {
		splName: videoData.spl.spl_name,
		splPublicKey: videoData.spl.public_key_address,
		listingSharePriceUsd: videoData.spl.listing_price_per_share_usd,
		splListingStatus: videoData.spl.spl_listing_status,
		description: videoData.spl.description,
		imageUrl: videoData.spl.uploaded_image.image_url,
		uuid: videoData.uuid,
		totalNumberShares: videoData.spl.total_number_of_shares,
		sharesRemainingForSale,
		originalContentUrl: videoData.spl.original_content_url,
		contentMintDate: videoData.created_at,
		creatorUsername: videoData.spl.spl_creator_wallet.user.username,
		creatorProfilePictureUrl: videoData.spl.spl_creator_wallet.user.profile_picture?.image_url || null,
		isSplExclusive: videoData.spl.is_spl_exclusive,
		valueNeededToAccessExclusiveContentUsd:  videoData.spl.value_needed_to_access_exclusive_content_usd,
		isContentInstantlyAccessible: videoData.spl.is_content_instantly_accessible,
		listingPriceToAccessContentUsd: videoData.spl.instant_access_price_to_exclusive_content_usd,
		allowValueFromSameCreatorTokensForExclusiveContent: videoData.spl.allow_value_from_same_creator_tokens_for_exclusive_content

	}

	if (!_.isUndefined(videoData.videoUrl)) {
		videoDataSendingToFrontEnd.videoUrl = videoData.videoUrl
	}

	return videoDataSendingToFrontEnd
}
