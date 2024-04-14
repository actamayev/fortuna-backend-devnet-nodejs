declare global {
	interface VideoRetrievedFromDB {
		video_url: string
		created_at: Date
		uuid: string
		spl: { spl_name: string, listing_price_per_share_sol: number, description: string }
	}

	interface VideoDataSendingToFrontend {
		splName: string
		offeringSharePriceSol: number
		description: string
		imageUrl: string
		videoUrl: string
		uuid: string
	}
}

export {}
