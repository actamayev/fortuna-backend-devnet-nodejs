export default function createBidOrderDataToReturn(
	bidId: number,
	splDetails: SplByPublicKeyData,
	createSplBidData: CreateSplBidData,
	numberOfRemainingSharesToBuy: number
): TransformedUserBidData {
	try {
		return {
			secondaryMarketBidId: bidId,
			splId: splDetails.splId,
			bidPricePerShareUsd: createSplBidData.bidPricePerShareUsd,
			wasBidCancelledDueToFundRequirements: false,
			numberOfSharesBiddingFor: createSplBidData.numberOfSharesBiddingFor,
			remainingNumberOfSharesBiddingFor: numberOfRemainingSharesToBuy,
			createdAt: new Date(),
			splName: splDetails.splName,
			uuid: splDetails.uuid
		}
	} catch (error) {
		console.error(error)
		throw error
	}
}
