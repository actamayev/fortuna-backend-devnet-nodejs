import _ from "lodash"
import checkIfUserMadeExclusiveVideoPurchases
	from "../../db-operations/read/exclusive-video-access-purchase/check-if-user-made-exclusive-video-purchases"

interface ExclusiveVideoAccessRecord {
	[videoId: number]: boolean
}

// eslint-disable-next-line max-lines-per-function, complexity
export default async function checkWhichExclusiveContentUserAllowedToAccess(
	retrievedSpls: VideoDataNeededToCheckForExclusiveContentAccess[],
	userSolanaWalletId: number | undefined
): Promise<ExclusiveVideoAccessRecord> {
	try {
		const accessRecord: ExclusiveVideoAccessRecord = {}
		retrievedSpls = retrievedSpls.filter(retrievedSpl => {
			if (retrievedSpl.is_video_exclusive === false || retrievedSpl.creator_wallet_id === userSolanaWalletId) {
				accessRecord[retrievedSpl.video_id] = true
				return false
			}
			return true
		})

		if (_.isEmpty(retrievedSpls)) return accessRecord

		if (_.isUndefined(userSolanaWalletId)) {
			retrievedSpls.forEach(spl => accessRecord[spl.video_id] = false)
			return accessRecord
		}

		const videoIds = retrievedSpls.map(spl => spl.video_id)
		const exclusiveSplData = await checkIfUserMadeExclusiveVideoPurchases(videoIds, userSolanaWalletId)

		retrievedSpls.map(retrievedSpl => {
			const didUserPurchaseSplAccess = exclusiveSplData[retrievedSpl.video_id]
			accessRecord[retrievedSpl.video_id] = didUserPurchaseSplAccess
		})

		return accessRecord
	} catch (error) {
		console.error(error)
		throw error
	}
}
