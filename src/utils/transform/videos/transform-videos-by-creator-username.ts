import _ from "lodash"
import checkWhichExclusiveContentUserAllowedToAccess from "../../exclusive-content/check-which-exclusive-content-user-allowed-to-access"

interface VideosAndCreatorData {
	videoData: VideoDataSendingToFrontendLessVideoUrl[]
	creatorData: CreatorSearchDataSendingToFrontend
}

// eslint-disable-next-line max-lines-per-function
export default async function transformVideosByCreatorUsername(
	retrievedVideoData: RetrievedVideosByCreatorUsername,
	walletId: number | undefined,
	userId: number | undefined
): Promise<VideosAndCreatorData | null> {
	try {
		if (_.isNull(retrievedVideoData.solana_wallet)) return null

		const validEntries = retrievedVideoData.solana_wallet.video_creator_wallet

		// Fetch remaining tokens for these public keys
		const userAllowedToAccessContent = await checkWhichExclusiveContentUserAllowedToAccess(
			retrievedVideoData.solana_wallet.video_creator_wallet,
			walletId
		)
		// Transform data using validated and filtered entries
		const videoData = validEntries.map(item => {
			const isUserAbleToAccessVideo = userAllowedToAccessContent[item.video_id]
			let numberOfLikes = 0
			let numberOfDislikes = 0
			let userLikeStatus: null | boolean = null
			item.video_like_status.map(videoLikeStatus => {
				if (videoLikeStatus.like_status === true) numberOfLikes += 1
				else numberOfDislikes += 1
				if (videoLikeStatus.user_id === userId) userLikeStatus = videoLikeStatus.like_status
			})
			return {
				videoName: item.video_name,
				videoListingStatus: item.video_listing_status,
				description: item.description,
				imageUrl: item.uploaded_image.image_url,
				uuid: item.uuid,
				creatorUsername: retrievedVideoData.username,
				creatorProfilePictureUrl: retrievedVideoData.profile_picture?.image_url || null,
				isVideoExclusive: item.is_video_exclusive,
				isUserAbleToAccessVideo,
				createdAt: item.created_at,
				numberOfExclusivePurchasesSoFar: item.numberOfExclusivePurchasesSoFar,
				tierData: item.video_access_tier.map(tier => ({
					tierNumber: tier.tier_number,
					purchasesInThisTier: tier.purchases_allowed_for_this_tier,
					tierDiscount: tier.percent_discount_at_this_tier,
					tierAccessPriceUsd: tier.tier_access_price_usd,
					isTierSoldOut: tier.is_sold_out
				})),
				numberOfLikes,
				numberOfDislikes,
				userLikeStatus,
			}
		})

		// Prepare creator data
		const creatorData: CreatorSearchDataSendingToFrontend = {
			creatorUsername: retrievedVideoData.username,
			creatorProfilePictureUrl: retrievedVideoData.profile_picture?.image_url || null
		}

		return { videoData, creatorData }
	} catch (error) {
		console.error("Error in processing video data:", error)
		throw error
	}
}
