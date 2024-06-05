import _ from "lodash"
import checkIfUserMadeExclusiveVideoPurchase
	from "../../db-operations/read/exclusive-video-access-purchase/check-if-user-made-exclusive-video-purchase"

export default async function checkIfUserAllowedToAccessContent(
	retrievedVideo: VideoDataNeededToCheckForExclusiveContentAccess,
	userSolanaWalletId: number | undefined
): Promise<boolean> {
	try {
		if (retrievedVideo.is_video_exclusive === false) return true
		if (userSolanaWalletId === retrievedVideo.creator_wallet_id) return true

		if (_.isUndefined(userSolanaWalletId)) return false

		const didUserPurchaseVideoAccess = await checkIfUserMadeExclusiveVideoPurchase(retrievedVideo.video_id, userSolanaWalletId)
		return didUserPurchaseVideoAccess
	} catch (error) {
		console.error(error)
		throw error
	}
}
