declare global {
	interface PurchasePrimarySPLTokensData {
		numberOfTokensPurchasing: number
		splPublicKey: string
	}

	interface TransactionsMap {
		fillPriceUsd: number
		numberOfShares: number
	}
}

export {}
