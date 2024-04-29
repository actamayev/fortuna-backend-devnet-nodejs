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
			original_content_url: string | null
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

	interface RetrievedVideosByTitle {
		spl_name: string
		public_key_address: string
		listing_price_per_share_sol: number
		listing_price_per_share_usd: number
		total_number_of_shares: number
		description: string
		original_content_url: string | null
		spl_creator_wallet: {
			user: {
				username: string
				profile_picture: {
					image_url: string
				} | null
			}
		}
		uploaded_image: {
			image_url: string
		}
		uploaded_video: {
			video_url: string
			created_at: Date
			uuid: string
		}
	}

	interface RetrievedVideosByCreatorUsername {
		solana_wallet: {
			spl_creator_wallet: {
				spl_name: string
				public_key_address: string
				listing_price_per_share_sol: number
				listing_price_per_share_usd: number
				total_number_of_shares: number
				original_content_url: string | null
				description: string
				uploaded_image: {
					image_url: string
				}
				uploaded_video: {
					video_url: string
					created_at: Date
					uuid: string
				}
			}[]
		} | null
		username: string
		profile_picture: {
			image_url: string
		} | null
	}

	interface RetrievedCreatorsByUsername {
		username: string
		profile_picture: {
			image_url: string
		} | null
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
		originalContentUrl: string | null
		contentMintDate: Date
		creatorUsername: string
		creatorProfilePictureUrl: string | null
	}

	interface CreatorSearchDataSendingToFrontend {
		creatorUsername: string
		creatorProfilePictureUrl: string | null
	}

	type SearchData = VideoDataSendingToFrontend | CreatorSearchDataSendingToFrontend
}

export {}
