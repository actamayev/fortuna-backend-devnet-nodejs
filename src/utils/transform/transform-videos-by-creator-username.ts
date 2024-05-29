import _ from "lodash"
import EscrowWalletManager from "../../classes/escrow-wallet-manager"
import checkWhichExclusiveContentUserAllowedToAccess from "../exclusive-content/check-which-exclusive-content-user-allowed-to-access"

interface VideosAndCreatorData {
	videoData: VideoDataSendingToFrontendLessVideoUrl[]
	creatorData: CreatorSearchDataSendingToFrontend
}

// eslint-disable-next-line max-lines-per-function
export default async function transformVideosByCreatorUsername(
	input: RetrievedVideosByCreatorUsername,
	walletId: number | undefined
): Promise<VideosAndCreatorData | null> {
	try {
		if (_.isNull(input.solana_wallet)) return null

		const validEntries = input.solana_wallet.spl_creator_wallet

		// Extract public keys from valid entries
		const publicKeys = validEntries.map(wallet => wallet.public_key_address)

		// Fetch remaining tokens for these public keys
		const tokensRemaining = await EscrowWalletManager.getInstance().retrieveTokenAmountsByPublicKeys(publicKeys)
		const userAllowedToAccessContent = await checkWhichExclusiveContentUserAllowedToAccess(
			input.solana_wallet.spl_creator_wallet,
			walletId
		)
		// Transform data using validated and filtered entries
		const videoData = validEntries.map(wallet => {
			const sharesRemainingForSale = tokensRemaining[wallet.public_key_address] || 0
			const isUserAbleToAccessVideo = userAllowedToAccessContent[wallet.spl_id]
			return {
				splName: wallet.spl_name,
				splPublicKey: wallet.public_key_address,
				listingSharePriceUsd: wallet.listing_price_per_share_usd,
				splListingStatus: wallet.spl_listing_status,
				description: wallet.description,
				imageUrl: wallet.uploaded_image.image_url,
				videoUrl: wallet.uploaded_video.videoUrl,
				uuid: wallet.uploaded_video.uuid,
				totalNumberShares: wallet.total_number_of_shares,
				sharesRemainingForSale,
				originalContentUrl: wallet.original_content_url,
				contentMintDate: wallet.uploaded_video.created_at,
				creatorUsername: input.username,
				creatorProfilePictureUrl: input.profile_picture?.image_url || null,
				isSplExclusive: wallet.is_spl_exclusive,
				valueNeededToAccessExclusiveContentUsd: wallet.value_needed_to_access_exclusive_content_usd,
				isContentInstantlyAccessible: wallet.is_content_instantly_accessible,
				priceToInstantlyAccessExclusiveContentUsd: wallet.instant_access_price_to_exclusive_content_usd,
				allowValueFromSameCreatorTokensForExclusiveContent: wallet.allow_value_from_same_creator_tokens_for_exclusive_content,
				isUserAbleToAccessVideo
			}
		})

		// Prepare creator data
		const creatorData: CreatorSearchDataSendingToFrontend = {
			creatorUsername: input.username,
			creatorProfilePictureUrl: input.profile_picture?.image_url || null
		}

		return { videoData, creatorData }
	} catch (error) {
		console.error("Error in processing video data:", error)
		throw error
	}
}
