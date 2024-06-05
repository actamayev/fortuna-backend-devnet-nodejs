import _ from "lodash"
import checkIfUserMadeExclusiveVideoPurchases
	from "../../db-operations/read/exclusive-video-access-purchase/check-if-user-made-exclusive-video-purchases"

interface ExclusiveVideoAccessRecord {
	[videoId: number]: boolean
}

// eslint-disable-next-line max-lines-per-function, complexity
export default async function checkWhichExclusiveContentUserAllowedToAccess(
	retirevedVideos: VideoDataNeededToCheckForExclusiveContentAccess[],
	userSolanaWalletId: number | undefined
): Promise<ExclusiveVideoAccessRecord> {
	try {
		const accessRecord: ExclusiveVideoAccessRecord = {}
		retirevedVideos = retirevedVideos.filter(retrievedVideo => {
			if (retrievedVideo.is_video_exclusive === false || retrievedVideo.creator_wallet_id === userSolanaWalletId) {
				accessRecord[retrievedVideo.video_id] = true
				return false
			}
			return true
		})

		if (_.isEmpty(retirevedVideos)) return accessRecord

		if (_.isUndefined(userSolanaWalletId)) {
			retirevedVideos.forEach(video => accessRecord[video.video_id] = false)
			return accessRecord
		}

		const videoIds = retirevedVideos.map(video => video.video_id)
		const exclusiveVideoData = await checkIfUserMadeExclusiveVideoPurchases(videoIds, userSolanaWalletId)

		retirevedVideos.map(retrievedVideo => {
			const didUserPurchaseVideoAccess = exclusiveVideoData[retrievedVideo.video_id]
			accessRecord[retrievedVideo.video_id] = didUserPurchaseVideoAccess
		})

		return accessRecord
	} catch (error) {
		console.error(error)
		throw error
	}
}
