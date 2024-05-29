import _ from "lodash"
import retrieveSplOwnershipsByWalletIdAndSplIds
	from "../../db-operations/read/spl-ownership/retrieve-spl-ownerships-by-wallet-id-and-spl-id"
import checkIfUserMadeExclusiveSplPurchases
	from "../../db-operations/read/exclusive-spl-purchase/check-if-user-made-exclusive-spl-purchases"
import retrieveSplOwnershipsByWalletIdAndCreatorIds
	from "../../db-operations/read/spl-ownership/retrieve-spl-ownerships-by-wallet-id-and-creator-ids"

interface ExclusiveVideoAccessRecord {
	[splId: number]: boolean
}

// eslint-disable-next-line max-lines-per-function
export default async function checkWhichExclusiveContentUserAllowedToAccess(
	retrievedSpls: SplDataNeededToCheckForExclusiveContentAccess[],
	userSolanaWalletId: number | undefined
): Promise<ExclusiveVideoAccessRecord> {
	try {
		const accessRecord: ExclusiveVideoAccessRecord = {}
		retrievedSpls = retrievedSpls.filter(retrievedSpl => {
			if (retrievedSpl.is_spl_exclusive === false || retrievedSpl.creator_wallet_id === userSolanaWalletId) {
				accessRecord[retrievedSpl.spl_id] = true
				return false
			}
			return true
		})

		if (_.isUndefined(userSolanaWalletId)) {
			retrievedSpls.forEach(spl => accessRecord[spl.spl_id] = false)
			return accessRecord
		}

		let splIds = retrievedSpls.map(spl => spl.spl_id)
		const exclusiveSplData = await checkIfUserMadeExclusiveSplPurchases(splIds, userSolanaWalletId)

		retrievedSpls = retrievedSpls.filter(retrievedSpl => {
			const didUserPurchaseSplAccess = exclusiveSplData[retrievedSpl.spl_id]
			if (didUserPurchaseSplAccess === true) {
				accessRecord[retrievedSpl.spl_id] = true
				return false
			}
			if (
				_.isNull(retrievedSpl.value_needed_to_access_exclusive_content_usd) ||
				_.isNull(retrievedSpl.allow_value_from_same_creator_tokens_for_exclusive_content)
			) {
				accessRecord[retrievedSpl.spl_id] = false
				return false
			}
			return true
		})

		const splsThatDontAllowForValueFromSameCreatorForExclusiveContent = retrievedSpls.filter(
			retrievedSpl => retrievedSpl.allow_value_from_same_creator_tokens_for_exclusive_content === false
		)

		splIds = retrievedSpls.map(spl => spl.spl_id)

		if (!_.isEmpty(splsThatDontAllowForValueFromSameCreatorForExclusiveContent)) {
			const splOwnershipsByWalletIdAndSplIds = await retrieveSplOwnershipsByWalletIdAndSplIds(splIds, userSolanaWalletId)
			for (const retrievedSpl of splsThatDontAllowForValueFromSameCreatorForExclusiveContent) {
				const numberSharesNeededToAccessExclusiveContent =
					(retrievedSpl.value_needed_to_access_exclusive_content_usd as number) / retrievedSpl.listing_price_per_share_usd

				const userOwnership = splOwnershipsByWalletIdAndSplIds[retrievedSpl.spl_id] || 0
				accessRecord[retrievedSpl.spl_id] = userOwnership >= numberSharesNeededToAccessExclusiveContent
			}
		}

		const splsThatAllowForValueFromSameCreatorForExclusiveContent = retrievedSpls.filter(
			retrievedSpl => retrievedSpl.allow_value_from_same_creator_tokens_for_exclusive_content === true
		)
		splIds = retrievedSpls.map(spl => spl.spl_id)

		if (!_.isEmpty(splsThatAllowForValueFromSameCreatorForExclusiveContent)) {
			const splOwnershipsByWalletIdAndCreatorIds = await retrieveSplOwnershipsByWalletIdAndCreatorIds(
				userSolanaWalletId,
				splIds
			)
			for (const retrievedSpl of splsThatAllowForValueFromSameCreatorForExclusiveContent) {
				const userOwnershipValue = splOwnershipsByWalletIdAndCreatorIds[retrievedSpl.spl_id] || 0
				accessRecord[retrievedSpl.spl_id] =
					userOwnershipValue >= (retrievedSpl.value_needed_to_access_exclusive_content_usd as number)
			}
		}

		return accessRecord
	} catch (error) {
		console.error(error)
		throw error
	}
}
