declare global {
	interface PurchasePrimarySPLTokensData {
		numberOfTokensPurchasing: number
		splPublicKey: string
	}

	interface CreateSplBidData {
		splPublicKey: string
		numberOfSharesBiddingFor: number
		bidPricePerShareUsd: number
	}

	interface CreateSplAskData {
		splPublicKey: string
		numberOfSharesAskingFor: number
		askPricePerShareUsd: number
	}

	interface RetrievedUserAskDataBelowCertainPrice {
		secondary_market_ask_id: number
		spl_id: number
		remaining_number_of_shares_for_sale: number
		ask_price_per_share_usd: number
		solana_wallet: ExtendedSolanaWallet
	}

	interface RetrievedUserBidDataAboveCertainPrice {
		secondary_market_bid_id: number
		spl_id: number
		remaining_number_of_shares_bidding_for: number
		bid_price_per_share_usd: number
		solana_wallet: ExtendedSolanaWallet
	}

	interface TransactionsMap {
		fillPriceUsd: number
		numberOfShares: number
	}

	interface RetrievedOpenAskOrdersData {
		secondary_market_ask_id: number
		spl_id: number
		number_of_shares_for_sale: number
		remaining_number_of_shares_for_sale: number
		ask_price_per_share_usd: number
	}

	interface RetrievedUserAskData extends RetrievedOpenAskOrdersData{
		created_at: Date
	}

	interface RetrievedOpenBidOrdersData {
		secondary_market_bid_id: number
		spl_id: number
		number_of_shares_bidding_for: number
		bid_price_per_share_usd: number
	}

	interface RetrievedUserBidData extends RetrievedOpenBidOrdersData {
		created_at: Date
		was_bid_cancelled_due_to_fund_requirements: boolean
	}
}

export {}
