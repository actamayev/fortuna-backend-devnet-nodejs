import EscrowWalletManager from "../../classes/escrow-wallet-manager"

export default async function transformVideoSearchData(input: RetrievedVideosByTitle[]): Promise<VideoDataSendingToFrontend[]> {
	try {
		const publicKeys = input.map(item => item.public_key_address)

		const tokensRemaining = await EscrowWalletManager.getInstance().retrieveTokenAmountsByPublicKeys(publicKeys)

		const results = input.map(item => {
			const sharesRemainingForSale = tokensRemaining[item.public_key_address]
			return {
				splName: item.spl_name,
				splPublicKey: item.public_key_address,
				offeringSharePriceSol: item.listing_price_per_share_sol,
				offeringSharePriceUsd: item.listing_price_per_share_usd,
				description: item.description,
				imageUrl: item.uploaded_image.image_url,
				videoUrl: item.uploaded_video.video_url,
				uuid: item.uploaded_video.uuid,
				totalNumberShares: item.total_number_of_shares,
				sharesRemainingForSale,
				originalContentUrl: item.original_content_url,
				contentMintDate: item.uploaded_video.created_at,
				creatorUsername: item.spl_creator_wallet.user.username,
				creatorProfilePictureUrl: item.spl_creator_wallet.user.profile_picture?.image_url || null
			}
		})

		return results
	} catch (error) {
		console.error(error)
		throw error
	}
}
