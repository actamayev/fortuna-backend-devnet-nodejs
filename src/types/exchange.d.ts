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
		ask_price_per_share_usd: number
	}

	interface RetrievedUserAskData extends RetrievedOpenAskOrdersData {
		number_of_shares_for_sale: number
		remaining_number_of_shares_for_sale: number
		created_at: Date
		spl: {
			spl_name: string
			uploaded_video: {
				uuid: string
			}
		}
	}

	interface TransformedAskOrderData {
		secondaryMarketAskId: number
		splId: number
		askPricePerShareUsd: number
	}

	interface TransformedUserAskData extends TransformedAskOrderData {
		numberOfsharesForSale: number
		remainingNumberOfSharesForSale: number
		createdAt: Date
		splName: string
		uuid: string
	}

	interface RetrievedOpenBidOrdersData {
		secondary_market_bid_id: number
		spl_id: number
		bid_price_per_share_usd: number
	}

	interface RetrievedUserBidData extends RetrievedOpenBidOrdersData {
		was_bid_cancelled_due_to_fund_requirements: boolean
		number_of_shares_bidding_for: number
		remaining_number_of_shares_bidding_for: umber
		created_at: Date
		spl: {
			spl_name: string
			uploaded_video: {
				uuid: string
			}
		}
	}

	interface TransformedBidOrderData {
		secondaryMarketBidId: number
		splId: number
		bidPricePerShareUsd: number
	}

	interface TransformedUserBidData extends TransformedBidOrderData {
		wasBidCancelledDueToFundRequirements: boolean
		numberOfSharesBiddingFor: number
		remainingNumberOfSharesBiddingFor: umber
		createdAt: Date
		splName: string
		uuid: string
	}

	interface OpenOrders {
		bids: TransformedBidOrderData[]
		asks: TransformedAskOrderData[]
	}

	interface UserOrders {
		asks: TransformedUserAskData[]
		bids: TransformedUserBidData[]
	}
}

export {}
