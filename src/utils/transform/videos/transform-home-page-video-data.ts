import checkWhichExclusiveContentUserAllowedToAccess from "../../exclusive-content/check-which-exclusive-content-user-allowed-to-access"

// eslint-disable-next-line max-lines-per-function
export default async function transformHomePageVideoData(
	retrievedHomePageVideos: RetrievedHomePageVideosFromDB[],
	optionallyAttachedUser: ExtendedCredentials | undefined
): Promise<VideoDataSendingToFrontendLessVideoUrl[]> {
	try {
		const userAllowedToAccessContent = await checkWhichExclusiveContentUserAllowedToAccess(
			retrievedHomePageVideos,
			optionallyAttachedUser?.user_id
		)

		const results = retrievedHomePageVideos.map(item => {
			const isUserAbleToAccessVideo = userAllowedToAccessContent[item.video_id]
			let numberOfLikes = 0
			let numberOfDislikes = 0
			let userLikeStatus: null | boolean = null
			item.video_like_status.map(videoLikeStatus => {
				if (videoLikeStatus.like_status === true) numberOfLikes ++
				else numberOfDislikes ++
				if (videoLikeStatus.user_id === optionallyAttachedUser?.user_id) {
					userLikeStatus = videoLikeStatus.like_status
				}
			})
			return {
				videoName: item.video_name,
				videoListingStatus: item.video_listing_status,
				description: item.description,
				imageUrl: item.uploaded_image.image_url,
				uuid: item.uuid,
				creatorUsername: item.video_creator.username,
				creatorProfilePictureUrl: item.video_creator.profile_picture?.image_url || null,
				isVideoExclusive: item.is_video_exclusive,
				isUserAbleToAccessVideo,
				createdAt: item.created_at,
				tierData: item.video_access_tier.map(tier => ({
					tierNumber: tier.tier_number,
					purchasesInThisTier: tier.purchases_allowed_for_this_tier,
					isTierFree: tier.is_tier_free,
					tierAccessPriceUsd: tier.tier_access_price_usd,
					isTierSoldOut: tier.is_sold_out
				})),
				numberOfLikes,
				numberOfDislikes,
				userLikeStatus,
				numberOfExclusivePurchasesSoFar: item.numberOfExclusivePurchasesSoFar,
			}
		})

		return results
	} catch (error) {
		console.error(error)
		throw error
	}
}
