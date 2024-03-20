declare global {
	interface UploadNFT {
		nftName: string
		numberOfShares: number
		creatorOwnershipPercentage: number
		sharePrice: number
		description?: string
	}
}

export {}
