export default function transformCreatorSearchData(input: RetrievedCreatorsByUsername[]): CreatorSearchDataSendingToFrontend[] {
	try {
		return input.map(item => ({
			channelName: item.channel_name,
			channelDescription: item.user.channel_description?.channel_description || "",
			creatorUsername: item.user.username,
			socialPlatformLinks: item.user.social_platform_link.map(singleData => ({
				socialPlatform: singleData.social_platform,
				socialLink: singleData.social_link
			})),
			creatorProfilePictureUrl: item.user.profile_picture?.image_url || null,
			channelBannerPictureUrl: item.user.channel_banner?.image_url || null,
			numberOfVideos: item.user._count.video
		}))
	} catch (error) {
		console.error(error)
		throw error
	}
}
