export default function transformCreatorSearchData(input: RetrievedCreatorsByUsername[]): CreatorSearchDataSendingToFrontend[] {
	try {
		return input.map(item => ({
			creatorUsername: item.username,
			creatorProfilePictureUrl: item.profile_picture?.image_url || null
		}))
	} catch (error) {
		console.error(error)
		throw error
	}
}
