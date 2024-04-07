declare global {
	interface SLPDataSavedToS3 {
		splName: string
		numberOfShares: number
		creatorOwnershipPercentage: number
		offeringSharePriceSol: number
		imageUrl: string
		videoUrl: string
		description: string
	}

	interface IncomingNewSPLData extends SLPDataSavedToS3 {
		uuid: string
		uploadedImageId: number
		uploadedVideoId: number
	}

	interface RetrievedDBSplData {
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

	interface TransferSolData {
		sendingTo: string
		sendingToPublicKeyOrUsername: "publicKey" | "username"
		transferAmountSol: number
	}
}

export {}
