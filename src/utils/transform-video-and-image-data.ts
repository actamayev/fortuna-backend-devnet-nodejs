export default function transformVideoAndImageData(
	videoData: VideoRetrievedFromDB,
	imageUrl: string,
	sharesRemainingForSale: number
): VideoDataSendingToFrontend {
	return {
		splName: videoData.spl.spl_name,
		offeringSharePriceSol: videoData.spl.listing_price_per_share_sol,
		description: videoData.spl.description,
		imageUrl,
		videoUrl: videoData.video_url,
		uuid: videoData.uuid,
		totalNumberShares: videoData.spl.total_number_of_shares,
		sharesRemainingForSale
	}
}
