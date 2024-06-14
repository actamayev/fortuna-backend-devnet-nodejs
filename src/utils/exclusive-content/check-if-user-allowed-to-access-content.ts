import checkIfUserMadeExclusiveVideoPurchase
	from "../../db-operations/read/exclusive-video-access-purchase/check-if-user-made-exclusive-video-purchase"

export default async function checkIfUserAllowedToAccessContent(
	retrievedVideo: VideoDataNeededToCheckForExclusiveContentAccess,
	userId: number
): Promise<boolean> {
	try {
		if (
			retrievedVideo.is_video_exclusive === false ||
			userId === retrievedVideo.creator_user_id
		) return true

		return await checkIfUserMadeExclusiveVideoPurchase(retrievedVideo.video_id, userId)
	} catch (error) {
		console.error(error)
		throw error
	}
}
