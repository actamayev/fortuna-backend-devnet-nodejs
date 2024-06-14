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

		const videoData = await retrieveVideoByUUID(videoUUID)
		if (_.isNull(videoData)) return res.status(500).json({ error: "Unable to find video for the provided UUID" })

		if (videoData.is_video_exclusive === false) {
			const videoUrl = await VideoUrlsManager.getInstance().getVideoUrl(videoData.uuid)
			videoData.videoUrl = videoUrl
		} else if (!_.isUndefined(optionallyAttachedUser)) {
			const isUserAbleToAccessVideo = await checkIfUserAllowedToAccessContent(
				videoData, optionallyAttachedUser.user_id
			)
			if (isUserAbleToAccessVideo === true) {
				const videoUrl = await VideoUrlsManager.getInstance().getVideoUrl(videoData.uuid)
				videoData.videoUrl = videoUrl
			}
		}

		const transformedVideoData = transformVideoByUUIDData(videoData, optionallyAttachedUser?.user_id)

		return res.status(200).json({ videoData: transformedVideoData })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to get video by UUID" })
	}
}
