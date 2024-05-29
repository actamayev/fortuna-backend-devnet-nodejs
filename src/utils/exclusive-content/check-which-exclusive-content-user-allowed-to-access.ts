import _ from "lodash"
import checkIfUserMadeExclusiveSplPurchases
	from "../../db-operations/read/exclusive-spl-purchase/check-if-user-made-exclusive-spl-purchases"
import retrieveSplOwnershipsByWalletIdAndSplIds
	from "../../db-operations/read/spl-ownership/retrieve-spl-ownerships-by-wallet-id-and-spl-id"
import retrieveSplOwnershipsByWalletIdAndCreatorIds
	from "../../db-operations/read/spl-ownership/retrieve-spl-ownerships-by-wallet-id-and-creator-ids"

interface ExclusiveVideoAccess {
	splId: number
	isUserAllowedToAccess: boolean
}

// eslint-disable-next-line max-lines-per-function, complexity
export default async function checkWhichExclusiveContentUserAllowedToAccess(
	retrievedSpls: SplDataNeededToCheckForExclusiveContentAccess[],
	userSolanaWalletId: number | undefined
): Promise<ExclusiveVideoAccess[]> {
	try {
		const arrayToReturn: ExclusiveVideoAccess[] = []
		retrievedSpls.map(retrievedSpl => {
			if (retrievedSpl.is_spl_exclusive === false) {
				arrayToReturn.push({ splId: retrievedSpl.spl_id, isUserAllowedToAccess: true})
				retrievedSpls.filter(retrievedSplf => retrievedSplf.spl_id !== retrievedSpl.spl_id)
			} else if (retrievedSpl.creator_wallet_id === userSolanaWalletId) {
				arrayToReturn.push({ splId: retrievedSpl.spl_id, isUserAllowedToAccess: true })
				retrievedSpls.filter(retrievedSplf => retrievedSplf.spl_id !== retrievedSpl.spl_id)
			}
		})
		let splIds = retrievedSpls.map(spl => spl.spl_id)

		const exclusiveSplData = await checkIfUserMadeExclusiveSplPurchases(splIds, userSolanaWalletId)

		for (const retrievedSpl of retrievedSpls) {
			const didUserPurchaseSplAccess = exclusiveSplData[retrievedSpl.spl_id]
			if (didUserPurchaseSplAccess === true) {
				arrayToReturn.push({ splId: retrievedSpl.spl_id, isUserAllowedToAccess: true })
				retrievedSpls.filter(retrievedSplf => retrievedSplf.spl_id !== retrievedSpl.spl_id)
				continue
			}

			if (
				_.isUndefined(userSolanaWalletId) ||
				_.isNull(retrievedSpl.value_needed_to_access_exclusive_content_usd) ||
				_.isNull(retrievedSpl.allow_value_from_same_creator_tokens_for_exclusive_content)
			) {
				arrayToReturn.push({ splId: retrievedSpl.spl_id, isUserAllowedToAccess: false })
				retrievedSpls.filter(retrievedSplf => retrievedSplf.spl_id !== retrievedSpl.spl_id)
				continue
			}
		}

		const splsThatDontAllowForValueFromSameCreatorForExclusiveContent = retrievedSpls.filter(
			retrievedSpl => retrievedSpl.allow_value_from_same_creator_tokens_for_exclusive_content === false
		)

		splIds = retrievedSpls.map(spl => spl.spl_id)

		if (!_.isEmpty(splsThatDontAllowForValueFromSameCreatorForExclusiveContent)) {
			const splOwnershipsByWalletIdAndSplIds = await retrieveSplOwnershipsByWalletIdAndSplIds(splIds, userSolanaWalletId as number)
			for (const retrievedSpl of retrievedSpls) {
				const numberSharesNeededToAccessExclusiveContent =
					(retrievedSpl.value_needed_to_access_exclusive_content_usd as number) / retrievedSpl.listing_price_per_share_usd

				const userOwnership = splOwnershipsByWalletIdAndSplIds[retrievedSpl.spl_id]
				arrayToReturn.push({
					splId: retrievedSpl.spl_id,
					isUserAllowedToAccess: userOwnership >= numberSharesNeededToAccessExclusiveContent
				})
				retrievedSpls.filter(retrievedSplf => retrievedSplf.spl_id !== retrievedSpl.spl_id)
			}
		}


		const splsThatAllowForValueFromSameCreatorForExclusiveContent = retrievedSpls.filter(
			retrievedSpl => retrievedSpl.allow_value_from_same_creator_tokens_for_exclusive_content === true
		)

		splIds = retrievedSpls.map(spl => spl.spl_id)

		if (!_.isEmpty(splsThatAllowForValueFromSameCreatorForExclusiveContent)) {
			const splOwnershipsByWalletIdAndSplIds = await retrieveSplOwnershipsByWalletIdAndCreatorIds(
				userSolanaWalletId as number,
				splIds
			)
			for (const retrievedSpl of retrievedSpls) {
				const userOwnershipValue = splOwnershipsByWalletIdAndSplIds[retrievedSpl.spl_id]
				arrayToReturn.push({
					splId: retrievedSpl.spl_id,
					isUserAllowedToAccess: userOwnershipValue >= (retrievedSpl.value_needed_to_access_exclusive_content_usd as number)
				})
				retrievedSpls.filter(retrievedSplf => retrievedSplf.spl_id !== retrievedSpl.spl_id)
			}
		}

		return arrayToReturn
	} catch (error) {
		console.error(error)
		throw error
	}
}
