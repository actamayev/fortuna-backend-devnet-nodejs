export default function transformVideoAndImageData(
	videoData: VideoRetrievedFromDB,
	imageUrl: string
): VideoDataSendingToFrontend {
	const sharesPurchased = videoData.spl.spl_transfer.reduce((acc, purchase) => acc + purchase.number_spl_shares_transferred, 0)

	return {
		splName: videoData.spl.spl_name,
		offeringSharePriceSol: videoData.spl.listing_price_per_share_sol,
		description: videoData.spl.description,
		imageUrl,
		videoUrl: videoData.video_url,
		uuid: videoData.uuid,
		totalNumberShares: videoData.spl.total_number_of_shares,
		sharesRemainingForSale: videoData.spl.total_number_of_shares - sharesPurchased
	}
}
