export default function transformCreatorContentList(input: RetrievedDBVideoData[]): OutputCreatorVideoData[] {
	try {
		return input.map(item => ({
			videoId: item.video_id,
			videoName: item.video_name,
			listingPriceToAccessUsd: item.listing_price_to_access_usd,
			videoListingStatus: item.video_listing_status,
			description: item.description,
			imageUrl: item.uploaded_image.image_url,
			uuid: item.uuid,
		}))
	} catch (error) {
		console.error(error)
		throw error
	}
}
