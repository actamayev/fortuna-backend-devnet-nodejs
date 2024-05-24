import _ from "lodash"
import { checkIfUserMadeExclusiveSplPurchase }
	from "../../db-operations/read/exclusive-spl-purchase/check-if-user-made-exclusive-spl-purchase"
import retrieveSplOwnershipByWalletIdAndCreatorId
	from "../../db-operations/read/spl-ownership/retrieve-spl-ownership-by-wallet-id-and-creator-id"
import retrieveSplOwnershipByWalletIdAndSplPublicKey
	from "../../db-operations/read/spl-ownership/retrieve-spl-ownership-by-wallet-id-and-spl-public-key"

export default async function checkIfUserAllowedToAccessContent(
	userSolanaWalletId: number,
	retrievedSpl: SplDataNeededToCheckForExclusiveContentAccess
): Promise<boolean> {
	try {
		if (retrievedSpl.is_spl_exclusive === false) return true
		if (userSolanaWalletId === retrievedSpl.creator_wallet_id) return true
		const didUserPurchaseSplAccess = await checkIfUserMadeExclusiveSplPurchase(userSolanaWalletId, retrievedSpl.spl_id)
		if (didUserPurchaseSplAccess === true) return true

		if (_.isNull(retrievedSpl.value_needed_to_access_exclusive_content_usd)) return false

		const numberSharesNeededToAccessExclusiveContent =
			retrievedSpl.value_needed_to_access_exclusive_content_usd / retrievedSpl.listing_price_per_share_usd
		if (retrievedSpl.allow_value_from_same_creator_tokens_for_exclusive_content === false) {
			const splOwnershipForThisSpecificSpl = await retrieveSplOwnershipByWalletIdAndSplPublicKey(
				userSolanaWalletId,
				retrievedSpl.public_key_address
			)
			let numberSharesOwned = 0

			splOwnershipForThisSpecificSpl.map(splOwnership => {
				numberSharesOwned += splOwnership.number_of_shares
			})

			if (numberSharesOwned > numberSharesNeededToAccessExclusiveContent) return true
		} else {
			const allUserSplOwnership = await retrieveSplOwnershipByWalletIdAndCreatorId(userSolanaWalletId, retrievedSpl.creator_wallet_id)
			let valueOfsharesOwned = 0

			allUserSplOwnership.map(userSplOwnership => {
				valueOfsharesOwned += userSplOwnership.number_of_shares * userSplOwnership.spl.listing_price_per_share_usd
			})

			if (valueOfsharesOwned > numberSharesNeededToAccessExclusiveContent) return true
		}

		return false
	} catch (error) {
		console.error(error)
		throw error
	}
}
