import _ from "lodash"
import { Request, Response } from "express"
import VideoUrlsManager from "../../classes/video-urls-manager"
import retrieveVideoDataForExclusiveContentCheckByUUID
	from "../../db-operations/read/video/retrieve-video-data-for-exclusive-content-check-by-uuid"
import checkIfUserAllowedToAccessContent from "../../utils/exclusive-content/check-if-user-allowed-to-access-content"

export default async function getVideoUrl(req: Request, res: Response): Promise<Response> {
	try {
		const { optionallyAttachedUser } = req
		const { videoUUID } = req.params

		const videoData = await retrieveVideoDataForExclusiveContentCheckByUUID(videoUUID)
		if (_.isNull(videoData)) return res.status(500).json({ error: "Unable to find video for the provided UUID" })

		let videoUrl
		if (videoData.is_video_exclusive === false) {
			videoUrl = await VideoUrlsManager.getInstance().getVideoUrl(videoUUID)
		} else if (!_.isUndefined(optionallyAttachedUser)) {
			const isUserAbleToAccessVideo = await checkIfUserAllowedToAccessContent(
				videoData, optionallyAttachedUser.user_id
			)
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
