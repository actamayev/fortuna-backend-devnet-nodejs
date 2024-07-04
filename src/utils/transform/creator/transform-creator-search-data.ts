export default function transformCreatorSearchData(input: RetrievedCreatorsByUsername[]): CreatorSearchDataSendingToFrontend[] {
	try {
		return input.map(item => ({
			channelName: item.channel_name?.channel_name || item.username,
			channelDescription: item.channel_description?.channel_description || "",
			creatorUsername: item.username,
			socialPlatformLinks: item.social_platform_link.map(singleData => ({
				socialPlatform: singleData.social_platform,
				socialLink: singleData.social_link
			})),
			creatorProfilePictureUrl: item.profile_picture?.image_url || null
		}))
	} catch (error) {
		console.error(error)
		throw error
	}
}
