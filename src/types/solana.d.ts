declare global {
	interface NewSPLData {
		splName: string
		numberOfShares: number
		creatorOwnershipPercentage: number
		offeringSharePrice: number
		imageUrl: string
		fileName: string
		uuid: string
		description?: string
	}
}

export {}
