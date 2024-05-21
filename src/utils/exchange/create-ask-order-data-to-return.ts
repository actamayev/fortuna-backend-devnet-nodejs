export default function createAskOrderDataToReturn(
	askId: number,
	splDetails: SplByPublicKeyData,
	createSplAskData: CreateSplAskData,
	numberOfRemainingSharesToSell: number
): TransformedUserAskData {
	try {
		return {
			secondaryMarketAskId: askId,
			splId: splDetails.splId,
			askPricePerShareUsd: createSplAskData.askPricePerShareUsd,
			numberOfsharesForSale: createSplAskData.numberOfSharesAskingFor,
			remainingNumberOfSharesForSale: numberOfRemainingSharesToSell,
			createdAt: new Date(),
			splName: splDetails.splName,
			uuid: splDetails.uuid
		}
	} catch (error) {
		console.error(error)
		throw error
	}
}
