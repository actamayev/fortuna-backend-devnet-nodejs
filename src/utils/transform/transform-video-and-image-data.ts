export default function transformVideoAndImageData(
	videoData: VideoRetrievedFromDB,
	imageUrl: string,
	sharesRemainingForSale: number
): VideoDataSendingToFrontend {
	return {
		splName: videoData.spl.spl_name,
		splPublicKey: videoData.spl.public_key_address,
		offeringSharePriceSol: videoData.spl.listing_price_per_share_sol,
		offeringSharePriceUsd: videoData.spl.listing_price_per_share_usd,
		description: videoData.spl.description,
		imageUrl,
		videoUrl: videoData.video_url,
		uuid: videoData.uuid,
		totalNumberShares: videoData.spl.total_number_of_shares,
		sharesRemainingForSale
	}
}
