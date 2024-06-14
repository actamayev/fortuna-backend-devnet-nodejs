import checkIfUserMadeExclusiveVideoPurchase
	from "../../db-operations/read/exclusive-video-access-purchase/check-if-user-made-exclusive-video-purchase"

export default async function checkIfUserAllowedToAccessContent(
	retrievedVideo: VideoDataNeededToCheckForExclusiveContentAccess,
	userSolanaWalletId: number
): Promise<boolean> {
	try {
		if (
			retrievedVideo.is_video_exclusive === false ||
			userSolanaWalletId === retrievedVideo.creator_wallet_id
		) return true

		return await checkIfUserMadeExclusiveVideoPurchase(retrievedVideo.video_id, userSolanaWalletId)
	} catch (error) {
		console.error(error)
		throw error
	}
}
