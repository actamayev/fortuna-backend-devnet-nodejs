export default function transformCreatorContentList(input: RetrievedDBSplData[]): OutputSplData[] {
	try {
		return input.map(item => ({
			splId: item.spl_id,
			numberOfShares: item.total_number_of_shares,
			offeringSharePriceSol: item.listing_price_per_share_sol,
			description: item.description,
			creatorOwnershipPercentage: item.initial_creator_ownership_percentage,
			imageUrl: item.uploaded_image.image_url,
			videoUrl: item.uploaded_video.video_url,
			uuid: item.uploaded_video.uuid,
			splName: item.spl_name,
			mintAddress: item.public_key_address
		}))
	} catch (error) {
		console.error(error)
		throw error
	}
}
