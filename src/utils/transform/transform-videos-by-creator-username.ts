import _ from "lodash"
import determineRemainingTokensInEscrowByPublicKeys from "../solana/determine-remaining-tokens-in-escrow-by-public-keys"

export default async function transformVideosByCreatorUsername(
	input: RetrievedVideosByCreatorUsername
): Promise<{ videoData: VideoDataSendingToFrontend[], creatorData: CreatorSearchDataSendingToFrontend } | null> {
	try {
		if (_.isNull(input.solana_wallet)) return null

		const validEntries = input.solana_wallet.spl_creator_wallet

		// Extract public keys from valid entries
		const publicKeys = validEntries.map(wallet => wallet.public_key_address)

		// Fetch remaining tokens for these public keys
		const tokensRemaining = await determineRemainingTokensInEscrowByPublicKeys(publicKeys)

		// Transform data using validated and filtered entries
		const videoData = validEntries.map(wallet => {
			const sharesRemainingForSale = tokensRemaining[wallet.public_key_address] || 0

			return {
				splName: wallet.spl_name,
				splPublicKey: wallet.public_key_address,
				offeringSharePriceSol: wallet.listing_price_per_share_sol,
				offeringSharePriceUsd: wallet.listing_price_per_share_usd,
				description: wallet.description,
				imageUrl: wallet.uploaded_image.image_url,
				videoUrl: wallet.uploaded_video.video_url,
				uuid: wallet.uploaded_video.uuid,
				totalNumberShares: wallet.total_number_of_shares,
				sharesRemainingForSale,
				originalContentUrl: wallet.original_content_url,
				contentMintDate: wallet.uploaded_video.created_at,
				creatorUsername: input.username,
				creatorProfilePictureUrl: input.profile_picture?.image_url || null
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
