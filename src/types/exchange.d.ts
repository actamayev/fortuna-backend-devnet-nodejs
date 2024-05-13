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

	interface RetrievedAsksBelowCertainPrice {
		secondary_market_ask_id: number
		spl_id: number
		remaining_number_of_shares_for_sale: number
		ask_price_per_share_usd: number
		solana_wallet: ExtendedSolanaWallet
	}

	interface RetrievedBidsAboveCertainPrice {
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

	interface RetrievedAsks {
		secondary_market_ask_id: number
		spl_id: number
		number_of_shares_for_sale: number
		remaining_number_of_shares_for_sale: number
		ask_price_per_share_usd: number
		created_at: Date
	}

	interface RetrievedBids {
		secondary_market_bid_id: number
		spl_id: number
		number_of_shares_bidding_for: number
		bid_price_per_share_usd: number
		was_bid_cancelled_due_to_fund_requirements: boolean
		created_at: Date
	}
}

export {}
