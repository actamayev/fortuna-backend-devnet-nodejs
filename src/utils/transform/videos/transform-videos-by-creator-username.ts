import checkWhichExclusiveContentUserAllowedToAccess from "../../exclusive-content/check-which-exclusive-content-user-allowed-to-access"

// eslint-disable-next-line max-lines-per-function
export default async function transformVideosByCreatorUsername(
	retrievedVideoData: RetrievedVideosByCreatorUsername,
	optionallyAttachedUser: ExtendedCredentials | undefined,
	creatorDetails: CreatorDetails | null
): Promise<VideosAndCreatorData | null> {
	try {
		// Fetch remaining tokens for these public keys
		const userAllowedToAccessContent = await checkWhichExclusiveContentUserAllowedToAccess(
			retrievedVideoData.videos,
			optionallyAttachedUser?.user_id
		)
		// Transform data using validated and filtered entries
		const videoData = retrievedVideoData.videos.map(item => {
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
				creatorUsername: retrievedVideoData.username,
				creatorProfilePictureUrl: retrievedVideoData.profile_picture_image_url,
				channelBannerPictureUrl: retrievedVideoData.channel_banner_image_url,
				isVideoExclusive: item.is_video_exclusive,
				isUserAbleToAccessVideo,
				createdAt: item.created_at,
				numberOfExclusivePurchasesSoFar: item.numberOfExclusivePurchasesSoFar,
				tierData: item.video_access_tier.map(tier => ({
					tierNumber: tier.tier_number,
					purchasesInThisTier: tier.purchases_allowed_for_this_tier,
					tierAccessPriceUsd: tier.tier_access_price_usd,
					isTierSoldOut: tier.is_sold_out
				})),
				numberOfLikes,
				userLikeStatus,
				channelName: retrievedVideoData.channel_name
			}
		})

		// Prepare creator data
		const creatorData: CreatorSearchDataSendingToFrontend = {
			channelName: retrievedVideoData.channel_name,
			channelDescription: creatorDetails?.channel_description?.channel_description || "",
			creatorUsername: retrievedVideoData.username,
			socialPlatformLinks: creatorDetails?.social_platform_link.map(singleData => ({
				socialPlatform: singleData.social_platform,
				socialLink: singleData.social_link
			})) || [],
			creatorProfilePictureUrl: retrievedVideoData.profile_picture_image_url,
			channelBannerPictureUrl: retrievedVideoData.channel_banner_image_url
		}

		return { videoData, creatorData }
	} catch (error) {
		console.error("Error in processing video data:", error)
		throw error
	}
}
