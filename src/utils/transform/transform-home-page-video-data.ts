import checkWhichExclusiveContentUserAllowedToAccess from "../exclusive-content/check-which-exclusive-content-user-allowed-to-access"

export default async function transformHomePageVideoData(
	retrievedHomePageVideos: RetrievedHomePageVideosFromDB[],
	solanaWalletId: number | undefined
): Promise<VideoDataSendingToFrontendLessVideoUrl[]> {
	try {
		const userAllowedToAccessContent = await checkWhichExclusiveContentUserAllowedToAccess(retrievedHomePageVideos, solanaWalletId)

		const results = retrievedHomePageVideos.map(item => {
			const isUserAbleToAccessVideo = userAllowedToAccessContent[item.video_id]
			return {
				videoName: item.video_name,
				listingPriceToAccessUsd: item.listing_price_to_access_usd,
				videoListingStatus: item.video_listing_status,
				description: item.description,
				imageUrl: item.uploaded_image.image_url,
				uuid: item.uuid,
				creatorUsername: item.video_creator_wallet.user.username,
				creatorProfilePictureUrl: item.video_creator_wallet.user.profile_picture?.image_url || null,
				isVideoExclusive: item.is_video_exclusive,
				isUserAbleToAccessVideo,
				createdAt: item.created_at
			}
		})

		return results
	} catch (error) {
		console.error(error)
		throw error
	}
}
