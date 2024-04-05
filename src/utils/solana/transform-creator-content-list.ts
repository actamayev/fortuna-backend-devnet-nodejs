interface InputSplData {
	spl_id: number
	spl_name: string
	total_number_of_shares: number
	listing_price_per_share_sol: number
	description: string
	initial_creator_ownership_percentage: number
	uploaded_image: { image_url: string }
	uploaded_video: { video_url: string }
	public_key_address: string
}

interface OutputSplData {
	splId: number
	splName: string
	numberOfShares: number
	offeringSharePriceSol: number
	description: string
	creatorOwnershipPercentage: number
	imageUrl: string
	videoUrl: string
	mintAddress: string
}

export default function transformCreatorContentList(input: InputSplData[]): OutputSplData[] {
	return input.map( item => ({
		splId: item.spl_id,
		numberOfShares: item.total_number_of_shares,
		offeringSharePriceSol: item.listing_price_per_share_sol,
		description: item.description,
		creatorOwnershipPercentage: item.initial_creator_ownership_percentage,
		imageUrl: item.uploaded_image.image_url,
		videoUrl: item.uploaded_video.video_url,
		splName: item.spl_name,
		mintAddress: item.public_key_address,
	}))
}
