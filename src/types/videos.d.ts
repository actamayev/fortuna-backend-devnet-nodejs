declare global {
	interface HomePageVideoRetrievedFromDB {
		video_url: string
		created_at: Date
		uuid: string
		spl: {
			spl_name: string
			listing_price_per_share_sol: number
			listing_price_per_share_usd: number
			description: string
			total_number_of_shares: number
			public_key_address: string
			uploaded_image: {
				image_url: string
			}
			spl_creator_wallet: {
				user: {
					username: string
					profile_picture: {
						image_url: string
					} | null
				}
			}
		}
	}

	interface VideoDataSendingToFrontend {
		splName: string
		splPublicKey: string
		offeringSharePriceSol: number
		offeringSharePriceUsd: number
		description: string
		imageUrl: string
		videoUrl: string
		uuid: string
		totalNumberShares: number
		sharesRemainingForSale: number
		creatorUsername: string
		creatorProfilePictureUrl: string | null
	}
}

export {}
