declare global {
	interface UploadNFT {
		nftName: string
		numberOfShares: number
		creatorOwnershipPercentage: number
		offeringSharePrice: number
		description?: string
	}

	interface NFTMetadataJSON extends UploadNFT {
		imageUrl: string
	}
}

export {}
