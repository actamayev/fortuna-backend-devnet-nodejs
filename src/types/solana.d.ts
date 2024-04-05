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

	interface NewSPLData extends SLPDataSavedToS3 {
		uuid: string
		uploadedImageId: number
		uploadedVideoId: number
	}
}

export {}
