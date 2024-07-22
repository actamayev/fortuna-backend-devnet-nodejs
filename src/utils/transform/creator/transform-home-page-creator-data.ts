export default function transformHomePageCreatorData(input: RetrievedHomePageCreators[]): CreatorSearchDataSendingToFrontend[] {
	try {
		return input.map(item => ({
			channelName: item.channel_name?.channel_name || item.username,
			channelDescription: item.channel_description?.channel_description || "",
			creatorUsername: item.username,
			socialPlatformLinks: item.social_platform_link.map(singleData => ({
				socialPlatform: singleData.social_platform,
				socialLink: singleData.social_link
			})),
			creatorProfilePictureUrl: item.profile_picture?.image_url || null,
			channelBannerPictureUrl: item.channel_banner?.image_url || null,
			numberOfVideos: item._count.video
		}))
	} catch (error) {
		console.error(error)
		throw error
	}
}
