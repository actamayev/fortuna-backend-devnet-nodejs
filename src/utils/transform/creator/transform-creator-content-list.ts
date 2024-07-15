export default function transformCreatorContentList(input: RetrievedCreatorDBVideoData[]): OutputCreatorVideoData[] {
	try {
		return input.map(item => {
			let totalCreatorProfitInSol = 0
			let totalCreatorProfitInUsd = 0
			item.exclusive_video_access_purchase.map(exclusiveVideoAccessPurchase => {
				totalCreatorProfitInSol += exclusiveVideoAccessPurchase.exclusive_video_access_purchase_sol_transfer.sol_amount_transferred
				totalCreatorProfitInUsd += exclusiveVideoAccessPurchase.exclusive_video_access_purchase_sol_transfer.usd_amount_transferred
			})
			return {
				videoId: item.video_id,
				videoName: item.video_name,
				videoListingStatus: item.video_listing_status,
				description: item.description,
				imageUrl: item.uploaded_image.image_url,
				uuid: item.uuid,
				isContentExclusive: item.is_video_exclusive,
				createdAt: item.created_at,
				tierData: item.video_access_tier.map(tier => ({
					tierNumber: tier.tier_number,
					purchasesInThisTier: tier.purchases_allowed_for_this_tier,
					tierAccessPriceUsd: tier.tier_access_price_usd,
					isTierSoldOut: tier.is_sold_out
				})),
				numberOfLikes: item.numberOfLikes,
				totalCreatorProfitInSol,
				totalCreatorProfitInUsd,
				numberOfExclusivePurchasesSoFar: item.numberOfExclusivePurchasesSoFar
			}
		})

	} catch (error) {
		console.error(error)
		throw error
	}
}
