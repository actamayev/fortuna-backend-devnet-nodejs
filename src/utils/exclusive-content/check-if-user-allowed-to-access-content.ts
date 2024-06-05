import _ from "lodash"
import checkIfUserMadeExclusiveVideoPurchase
	from "../../db-operations/read/exclusive-video-access-purchase/check-if-user-made-exclusive-video-purchase"

export default async function checkIfUserAllowedToAccessContent(
	retrievedSpl: VideoDataNeededToCheckForExclusiveContentAccess,
	userSolanaWalletId: number | undefined
): Promise<boolean> {
	try {
		if (retrievedSpl.is_video_exclusive === false) return true
		if (userSolanaWalletId === retrievedSpl.creator_wallet_id) return true

		if (_.isUndefined(userSolanaWalletId)) return false

		const didUserPurchaseSplAccess = await checkIfUserMadeExclusiveVideoPurchase(retrievedSpl.video_id, userSolanaWalletId)
		return didUserPurchaseSplAccess
	} catch (error) {
		console.error(error)
		throw error
	}
}
