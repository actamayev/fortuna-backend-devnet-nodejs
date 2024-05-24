import EscrowWalletManager from "../../classes/escrow-wallet-manager"

export default async function transformHomePageVideoData(
	input: HomePageVideoRetrievedFromDB[]
): Promise<VideoDataSendingToFrontendLessVideoUrl[]> {
	try {
		const publicKeys = input.map(item => item.spl.public_key_address)

		const tokensRemaining = await EscrowWalletManager.getInstance().retrieveTokenAmountsByPublicKeys(publicKeys)

		const results = input.map(item => {
			const sharesRemainingForSale = tokensRemaining[item.spl.public_key_address]
			return {
				splName: item.spl.spl_name,
				splPublicKey: item.spl.public_key_address,
				listingSharePriceUsd: item.spl.listing_price_per_share_usd,
				splListingStatus: item.spl.spl_listing_status,
				description: item.spl.description,
				imageUrl: item.spl.uploaded_image.image_url,
				uuid: item.uuid,
				totalNumberShares: item.spl.total_number_of_shares,
				sharesRemainingForSale,
				originalContentUrl: item.spl.original_content_url,
				contentMintDate: item.created_at,
				creatorUsername: item.spl.spl_creator_wallet.user.username,
				creatorProfilePictureUrl: item.spl.spl_creator_wallet.user.profile_picture?.image_url || null
			}
		})

		return results
	} catch (error) {
		console.error(error)
		throw error
	}
}
