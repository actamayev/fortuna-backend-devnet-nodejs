import _ from "lodash"
import { Request, Response } from "express"
import VideoUrlsManager from "../../classes/video-urls-manager"
import checkIfUserAllowedToAccessContent from "../../utils/exclusive-content/check-if-user-allowed-to-access-content"
import retrieveSplDataForExclusiveContent from "../../db-operations/read/uploaded-video/retrieve-spl-data-for-exclusive-content"

export default async function getVideoUrl(req: Request, res: Response): Promise<Response> {
	try {
		const solanaWallet = req.solanaWallet as ExtendedSolanaWallet | undefined
		const { videoUUID } = req.params

		const videoData = await retrieveSplDataForExclusiveContent(videoUUID)
		if (_.isNull(videoData)) return res.status(500).json({ error: "Unable to find video for the provided UUID" })

		let videoUrl
		if (videoData.is_spl_exclusive === false) {
			videoUrl = await VideoUrlsManager.getInstance().getVideoUrl(videoUUID)
		} else if (!_.isUndefined(solanaWallet)) {
			const isUserAbleToAccessVideo = await checkIfUserAllowedToAccessContent(solanaWallet.solana_wallet_id, videoData)
			if (isUserAbleToAccessVideo === true) {
				videoUrl = await VideoUrlsManager.getInstance().getVideoUrl(videoUUID)
			}
		}

		return res.status(200).json({ videoUrl })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to retrieve video URL" })
	}
}
