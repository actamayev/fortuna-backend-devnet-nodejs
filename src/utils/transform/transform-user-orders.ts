export function transformUserAsks(asks: RetrievedUserAskData[]): TransformedUserAskData[] {
	try {
		const transformedAsks: TransformedUserAskData[] = asks.map(ask => ({
			secondaryMarketAskId: ask.secondary_market_ask_id,
			splId: ask.spl_id,
			askPricePerShareUsd: ask.ask_price_per_share_usd,
			numberOfsharesForSale: ask.number_of_shares_for_sale,
			remainingNumberOfSharesForSale: ask.remaining_number_of_shares_for_sale,
			createdAt: ask.created_at
		}))

		return transformedAsks
	} catch (error) {
		console.error(error)
		throw error
	}
}

export function transformUserBids(bids: RetrievedUserBidData[]): TransformedUserBidData[] {
	try {

		const transformedBids: TransformedUserBidData[] = bids.map(bid => ({
			secondaryMarketBidId: bid.secondary_market_bid_id,
			splId: bid.spl_id,
			bidPricePerShareUsd: bid.bid_price_per_share_usd,
			wasBidCancelledDueToFundRequirements: bid.was_bid_cancelled_due_to_fund_requirements,
			nuberOfSharesBiddingFor: bid.number_of_shares_bidding_for,
			remainingNumberOfSharesBiddingFor: bid.remaining_number_of_shares_bidding_for,
			createdAt: bid.created_at
		}))

		return transformedBids
	} catch (error) {
		console.error(error)
		throw error
	}
}
