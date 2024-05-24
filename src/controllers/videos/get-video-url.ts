import _ from "lodash"
import { Request, Response } from "express"
import AwsS3 from "../../classes/aws-s3"
import retrieveSplDataForExclusiveContent from "../../db-operations/read/spl/retrieve-spl-data-for-exclusive-content"
import checkIfUserAllowedToAccessContent from "../../utils/exclusive-content/check-if-user-allowed-to-access-content"

export default async function getVideoUrl(req: Request, res: Response): Promise<Response> {
	try {
		const { videoUUID } = req.params

		const videoData = await retrieveSplDataForExclusiveContent(videoUUID)
		if (_.isNull(videoData)) return res.status(500).json({ error: "Unable to find video for the provided UUID" })

		let videoUrl
		if (!_.isUndefined(req.solanaWallet) || videoData.is_spl_exclusive === false) {
			const isUserAbleToAccessVideo = await checkIfUserAllowedToAccessContent(req.solanaWallet.solana_wallet_id, videoData)
			if (isUserAbleToAccessVideo === true) {
				videoUrl = await AwsS3.getInstance().getSignedVideoUrl(videoUUID)
			}
		}

		return res.status(200).json({ videoUrl })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to retrieve video URL" })
	}
}
