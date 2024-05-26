import _ from "lodash"
import retrieveSplOwnershipByWalletIdAndCreatorId
	from "../../db-operations/read/spl-ownership/retrieve-spl-ownership-by-wallet-id-and-creator-id"
import retrieveSplOwnershipByWalletIdAndSplPublicKey
	from "../../db-operations/read/spl-ownership/retrieve-spl-ownership-by-wallet-id-and-spl-public-key"

// This function returns if it's necessary to generate a videoUrl
export default async function checkIfNewSplPurchaseAllowsAccessToExclusiveContent(
	userSolanaWalletId: number,
	splDetails: SplByPublicKeyData,
	numberSharesPurchasing: number
): Promise<boolean> {
	try {
		if (splDetails.isSplExclusive === false) return false
		if (_.isNull(splDetails.valueNeededToAccessExclusiveContentUsd)) return false

		const numberSharesNeededToAccessExclusiveContent =
			splDetails.valueNeededToAccessExclusiveContentUsd / splDetails.listingSharePriceUsd

		if (numberSharesPurchasing >= numberSharesNeededToAccessExclusiveContent) return true

		if (_.isNull(splDetails.allowValueFromSameCreatorTokensForExclusiveContent)) return false

		if (splDetails.allowValueFromSameCreatorTokensForExclusiveContent === false) {
			const splOwnershipForThisSpecificSpl = await retrieveSplOwnershipByWalletIdAndSplPublicKey(
				userSolanaWalletId,
				splDetails.publicKeyAddress
			)
			let numberSharesOwned = 0

			splOwnershipForThisSpecificSpl.map(splOwnership => numberSharesOwned += splOwnership.number_of_shares)

			return numberSharesOwned >= numberSharesNeededToAccessExclusiveContent
		} else {
			const allUserSplOwnership = await retrieveSplOwnershipByWalletIdAndCreatorId(
				userSolanaWalletId,
				splDetails.creatorWalletId
			)
			let valueOfsharesOwned = 0

			allUserSplOwnership.map(userSplOwnership => {
				valueOfsharesOwned += userSplOwnership.number_of_shares * userSplOwnership.spl.listing_price_per_share_usd
			})

			return valueOfsharesOwned >= splDetails.valueNeededToAccessExclusiveContentUsd
		}
	} catch (error) {
		console.error(error)
		throw error
	}
}
