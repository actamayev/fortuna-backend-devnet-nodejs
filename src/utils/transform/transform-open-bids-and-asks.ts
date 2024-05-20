export default function transformOpenBidsAndAsks(
	asks: RetrievedOpenAskOrdersData[],
	bids: RetrievedOpenBidOrdersData[]
): OpenOrders {
	try {
		const transformedAsks: TransformedAskOrderData[] = asks.map(ask => ({
			secondaryMarketAskId: ask.secondary_market_ask_id,
			splId: ask.spl_id,
			askPricePerShareUsd: ask.ask_price_per_share_usd
		}))

		const transformedBids: TransformedBidOrderData[] = bids.map(bid => ({
			secondaryMarketBidId: bid.secondary_market_bid_id,
			splId: bid.spl_id,
			bidPricePerShareUsd: bid.bid_price_per_share_usd
		}))

		return {
			asks: transformedAsks,
			bids: transformedBids
		}

	} catch (error) {
		console.error(error)
		throw error
	}
}
