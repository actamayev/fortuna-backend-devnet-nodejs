export default function transformCreatorInfo(creatorDetails: CreatorDetails | null): CreatorInfoData {
	try {
		return {
			channelName: creatorDetails?.channel_name?.channel_name || null,
			channelDescription: creatorDetails?.channel_description?.channel_description || null,
			profilePictureUrl: creatorDetails?.profile_picture?.image_url || null,
			channelBannerUrl: creatorDetails?.channel_banner?.image_url || null,
			socialPlatformLinks: creatorDetails?.social_platform_link.map(singleData => ({
				socialPlatform: singleData.social_platform,
				socialLink: singleData.social_link
			})) || []
		}
	} catch (error) {
		console.error(error)
		throw error
	}
}
