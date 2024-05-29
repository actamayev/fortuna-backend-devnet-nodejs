import _ from "lodash"
import retrieveSplOwnershipByWalletIdAndCreatorId
	from "../../db-operations/read/spl-ownership/retrieve-spl-ownership-by-wallet-id-and-creator-id"
import retrieveSplOwnershipByWalletIdAndSplPublicKey
	from "../../db-operations/read/spl-ownership/retrieve-spl-ownership-by-wallet-id-and-spl-public-key"
import checkIfUserMadeExclusiveSplPurchase from "../../db-operations/read/exclusive-spl-purchase/check-if-user-made-exclusive-spl-purchase"

export default async function checkIfUserAllowedToAccessContent(
	retrievedSpl: SplDataNeededToCheckForExclusiveContentAccess,
	userSolanaWalletId: number | undefined
): Promise<boolean> {
	try {
		if (retrievedSpl.is_spl_exclusive === false) return true
		if (userSolanaWalletId === retrievedSpl.creator_wallet_id) return true
		const didUserPurchaseSplAccess = await checkIfUserMadeExclusiveSplPurchase(retrievedSpl.spl_id, userSolanaWalletId)
		if (didUserPurchaseSplAccess === true) return true

		if (
			_.isNull(retrievedSpl.value_needed_to_access_exclusive_content_usd) ||
			_.isNull(retrievedSpl.allow_value_from_same_creator_tokens_for_exclusive_content) ||
			_.isUndefined(userSolanaWalletId)
		) return false

		const numberSharesNeededToAccessExclusiveContent =
			retrievedSpl.value_needed_to_access_exclusive_content_usd / retrievedSpl.listing_price_per_share_usd

		if (retrievedSpl.allow_value_from_same_creator_tokens_for_exclusive_content === false) {
			const splOwnershipForThisSpecificSpl = await retrieveSplOwnershipByWalletIdAndSplPublicKey(
				userSolanaWalletId,
				retrievedSpl.public_key_address
			)
			let numberSharesOwned = 0

			splOwnershipForThisSpecificSpl.map(splOwnership => numberSharesOwned += splOwnership.number_of_shares)

			return numberSharesOwned >= numberSharesNeededToAccessExclusiveContent
		} else {
			const allUserSplOwnership = await retrieveSplOwnershipByWalletIdAndCreatorId(
				userSolanaWalletId,
				retrievedSpl.creator_wallet_id
			)
			let valueOfsharesOwned = 0

			allUserSplOwnership.map(userSplOwnership => {
				valueOfsharesOwned += userSplOwnership.number_of_shares * userSplOwnership.spl.listing_price_per_share_usd
			})

			return valueOfsharesOwned >= retrievedSpl.value_needed_to_access_exclusive_content_usd
		}
	} catch (error) {
		console.error(error)
		throw error
	}
}
