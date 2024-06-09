export default function transformCreatorContentList(input: RetrievedCreatorDBVideoData[]): OutputCreatorVideoData[] {
	try {
		return input.map(item => ({
			videoId: item.video_id,
			videoName: item.video_name,
			videoListingStatus: item.video_listing_status,
			description: item.description,
			imageUrl: item.uploaded_image.image_url,
			uuid: item.uuid,
			numberOfExclusivePurchasesSoFar: item.numberOfExclusivePurchasesSoFar,
			tierData: item.video_access_tier.map(tier => ({
				tierNumber: tier.tier_number,
				purchasesInThisTier: tier.purchases_allowed_for_this_tier,
				tierDiscount: tier.percent_discount_at_this_tier,
				tierAccessPrice: tier.tier_access_price_usd,
				isTierSoldOut: tier.is_sold_out
			})),
			isContentExclusive: item.is_video_exclusive
		}))
	} catch (error) {
		console.error(error)
		throw error
	}
}
