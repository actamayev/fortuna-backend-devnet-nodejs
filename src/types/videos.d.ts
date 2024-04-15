declare global {
	interface VideoRetrievedFromDB {
		video_url: string
		created_at: Date
		uuid: string
		spl: {
			spl_name: string
			listing_price_per_share_sol: number
			description: string
			total_number_of_shares: number
			public_key_address: string
			spl_transfer: {
				number_spl_shares_transferred: number
			}[]
		}
	}

	interface VideoDataSendingToFrontend {
		splName: string
		splPublicKey: string
		offeringSharePriceSol: number
		description: string
		imageUrl: string
		videoUrl: string
		uuid: string
		totalNumberShares: number
		sharesRemainingForSale: number
	}
}

export {}
