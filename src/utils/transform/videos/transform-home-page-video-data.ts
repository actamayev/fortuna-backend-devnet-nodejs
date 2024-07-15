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
			let userLikeStatus: boolean = false
			item.video_like_status.map(videoLikeStatus => {
				numberOfLikes ++
				if (videoLikeStatus.user_id === optionallyAttachedUser?.user_id) {
					userLikeStatus = true
				}
			})
			return {
				videoName: item.video_name,
				videoListingStatus: item.video_listing_status,
				description: item.description,
				imageUrl: item.uploaded_image.image_url,
				videoDurationSeconds: item.uploaded_video.video_duration_seconds,
				uuid: item.uuid,
				creatorUsername: item.video_creator.username,
				creatorProfilePictureUrl: item.video_creator.profile_picture?.image_url || null,
				channelBannerPictureUrl: item.video_creator.channel_banner?.image_url || null,
				isVideoExclusive: item.is_video_exclusive,
				isUserAbleToAccessVideo,
				createdAt: item.created_at,
				tierData: item.video_access_tier.map(tier => ({
					tierNumber: tier.tier_number,
					purchasesInThisTier: tier.purchases_allowed_for_this_tier,
					tierAccessPriceUsd: tier.tier_access_price_usd,
					isTierSoldOut: tier.is_sold_out
				})),
				numberOfLikes,
				userLikeStatus,
				numberOfExclusivePurchasesSoFar: item.numberOfExclusivePurchasesSoFar,
				channelName: item.video_creator.channel_name?.channel_name || item.video_creator.username
			}
		})

		return results
	} catch (error) {
		console.error(error)
		throw error
	}
}
