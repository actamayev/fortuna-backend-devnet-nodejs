export default function transformCreatorContentList(input: RetrievedCreatorDBVideoData[]): OutputCreatorVideoData[] {
	try {
		return input.map(item => ({
			videoName: item.video_name,
			videoListingStatus: item.video_listing_status,
			description: item.description,
			imageUrl: item.uploaded_image.image_url,
			uuid: item.uuid,
			isContentExclusive: item.is_video_exclusive,
			numberOfExclusivePurchasesSoFar: item.numberOfExclusivePurchasesSoFar,
			createdAt: item.created_at,
			tierData: item.video_access_tier.map(tier => ({
				tierNumber: tier.tier_number,
				purchasesInThisTier: tier.purchases_allowed_for_this_tier,
				tierDiscount: tier.percent_discount_at_this_tier,
				tierAccessPriceUsd: tier.tier_access_price_usd,
				isTierSoldOut: tier.is_sold_out
			}))
		}))
	} catch (error) {
		console.error(error)
		throw error
	}
}
