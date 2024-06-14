import _ from "lodash"
import { Response, Request } from "express"
import VideoUrlsManager from "../../classes/video-urls-manager"
import retrieveVideoByUUID from "../../db-operations/read/video/retrieve-video-by-uuid"
import transformVideoByUUIDData from "../../utils/transform/videos/transform-video-by-uuid-data"
import checkIfUserAllowedToAccessContent from "../../utils/exclusive-content/check-if-user-allowed-to-access-content"

export default async function getVideoByUUID (req: Request, res: Response): Promise<Response> {
	try {
		const { optionallyAttachedUser } = req
		const { videoUUID } = req.params

		const retrievedVideoData = await retrieveVideoByUUID(videoUUID)
		if (_.isNull(retrievedVideoData)) return res.status(500).json({ error: "Unable to find video for the provided UUID" })

		if (retrievedVideoData.is_video_exclusive === false) {
			const videoUrl = await VideoUrlsManager.getInstance().getVideoUrl(retrievedVideoData.uuid)
			retrievedVideoData.videoUrl = videoUrl
		} else if (!_.isUndefined(optionallyAttachedUser)) {
			const isUserAbleToAccessVideo = await checkIfUserAllowedToAccessContent(
				retrievedVideoData, optionallyAttachedUser.user_id
			)
			if (isUserAbleToAccessVideo === true) {
				const videoUrl = await VideoUrlsManager.getInstance().getVideoUrl(retrievedVideoData.uuid)
				retrievedVideoData.videoUrl = videoUrl
			}
		}

		const videoData = transformVideoByUUIDData(retrievedVideoData, optionallyAttachedUser?.user_id)

		return res.status(200).json({ videoData })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to get video by UUID" })
	}
}
