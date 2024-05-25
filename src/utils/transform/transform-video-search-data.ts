import EscrowWalletManager from "../../classes/escrow-wallet-manager"

export default async function transformVideoSearchData(input: RetrievedHomePageVideo[]): Promise<VideoDataSendingToFrontendLessVideoUrl[]> {
	try {
		const publicKeys = input.map(item => item.public_key_address)

		const tokensRemaining = await EscrowWalletManager.getInstance().retrieveTokenAmountsByPublicKeys(publicKeys)

		const results = input.map(item => {
			const sharesRemainingForSale = tokensRemaining[item.public_key_address]
			return {
				splName: item.spl_name,
				splPublicKey: item.public_key_address,
				listingSharePriceUsd: item.listing_price_per_share_usd,
				splListingStatus: item.spl_listing_status,
				description: item.description,
				imageUrl: item.uploaded_image.image_url,
				uuid: item.uploaded_video.uuid,
				totalNumberShares: item.total_number_of_shares,
				sharesRemainingForSale,
				originalContentUrl: item.original_content_url,
				contentMintDate: item.uploaded_video.created_at,
				creatorUsername: item.spl_creator_wallet.user.username,
				creatorProfilePictureUrl: item.spl_creator_wallet.user.profile_picture?.image_url || null,
				isSplExclusive: item.is_spl_exclusive,
				valueNeededToAccessExclusiveContentUsd:  item.value_needed_to_access_exclusive_content_usd,
				listingPriceToAccessContentUsd: item.listing_price_to_access_exclusive_content_usd,
				allowValueFromSameCreatorTokensForExclusiveContent: item.allow_value_from_same_creator_tokens_for_exclusive_content

			}
		})

		return results
	} catch (error) {
		console.error(error)
		throw error
	}
}
