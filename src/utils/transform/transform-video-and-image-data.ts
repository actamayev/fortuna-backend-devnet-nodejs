export default function transformVideoAndImageData(
	videoData: HomePageVideoRetrievedFromDB,
	sharesRemainingForSale: number
): VideoDataSendingToFrontend {
	return {
		splName: videoData.spl.spl_name,
		splPublicKey: videoData.spl.public_key_address,
		listingSharePriceUsd: videoData.spl.listing_price_per_share_usd,
		splListingStatus: videoData.spl.spl_listing_status,
		description: videoData.spl.description,
		imageUrl: videoData.spl.uploaded_image.image_url,
		videoUrl: videoData.video_url,
		uuid: videoData.uuid,
		totalNumberShares: videoData.spl.total_number_of_shares,
		sharesRemainingForSale,
		originalContentUrl: videoData.spl.original_content_url,
		contentMintDate: videoData.created_at,
		creatorUsername: videoData.spl.spl_creator_wallet.user.username,
		creatorProfilePictureUrl: videoData.spl.spl_creator_wallet.user.profile_picture?.image_url || null
	}
}
