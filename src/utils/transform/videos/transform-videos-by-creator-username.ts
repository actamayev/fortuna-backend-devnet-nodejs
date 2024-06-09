import _ from "lodash"
import checkWhichExclusiveContentUserAllowedToAccess from "../../exclusive-content/check-which-exclusive-content-user-allowed-to-access"

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

		const validEntries = input.solana_wallet.video_creator_wallet

		// Fetch remaining tokens for these public keys
		const userAllowedToAccessContent = await checkWhichExclusiveContentUserAllowedToAccess(
			input.solana_wallet.video_creator_wallet,
			walletId
		)
		// Transform data using validated and filtered entries
		const videoData = validEntries.map(wallet => {
			const isUserAbleToAccessVideo = userAllowedToAccessContent[wallet.video_id]
			return {
				videoName: wallet.video_name,
				videoListingStatus: wallet.video_listing_status,
				description: wallet.description,
				imageUrl: wallet.uploaded_image.image_url,
				uuid: wallet.uuid,
				creatorUsername: input.username,
				creatorProfilePictureUrl: input.profile_picture?.image_url || null,
				isVideoExclusive: wallet.is_video_exclusive,
				isUserAbleToAccessVideo,
				createdAt: wallet.created_at,
				numberOfExclusivePurchasesSoFar: wallet.numberOfExclusivePurchasesSoFar,
				tierData: wallet.video_access_tier.map(tier => ({
					tierNumber: tier.tier_number,
					purchasesInThisTier: tier.purchases_allowed_for_this_tier,
					tierDiscount: tier.percent_discount_at_this_tier,
					tierAccessPrice: tier.tier_access_price_usd,
					isTierSoldOut: tier.is_sold_out
				}))
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
