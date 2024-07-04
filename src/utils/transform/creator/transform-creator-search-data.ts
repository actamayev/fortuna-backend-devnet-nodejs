export default function transformCreatorSearchData(input: RetrievedCreatorsByUsername[]): CreatorSearchDataSendingToFrontend[] {
	try {
		return input.map(item => ({
			channelName: item.channel_name?.channel_name || item.username,
			channelDescription: item.channel_description?.channel_description || "",
			creatorUsername: item.username,
			creatorProfilePictureUrl: item.profile_picture?.image_url || null
		}))
	} catch (error) {
		console.error(error)
		throw error
	}
}
