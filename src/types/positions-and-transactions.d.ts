declare global {
	interface MyExclusiveContentData {
		videoName: string
		imageUrl: string
		uuid: string
		videoDurationSeconds: number
		purchaseDate: Date
		priceInSol: number
		priceInUsd: number
	}

	interface OutputTransactionData {
		solTransferId: number
		solAmountTransferred: number
		usdAmountTransferred: number
		transferByCurrency: Currencies
		depositOrWithdrawal: "deposit" | "withdrawal"

		transferDateTime: Date
		transferToUsername?: string
		transferToPublicKey?: string
		transferFromUsername: string
	}
}

export {}
