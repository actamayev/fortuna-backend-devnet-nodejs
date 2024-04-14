import _ from "lodash"
import { Response, Request } from "express"
import transformVideoAndImageData from "../../utils/transform-video-and-image-data"
import retrieveVideoByUUID from "../../utils/db-operations/read/uploaded-video/retrieve-video-by-uuid"
import retrieveImageUrlByUUID from "../../utils/db-operations/read/uploaded-image/retrieve-image-url-by-uuid"

export default async function getVideoByUUID (req: Request, res: Response): Promise<Response> {
	try {
		const videoUUID = req.params.videoUUID as string

		const videoData = await retrieveVideoByUUID(videoUUID)
		if (_.isNull(videoData)) return res.status(500).json({ error: "Unable to find video for the provided UUID" })

		const imageUrl = await retrieveImageUrlByUUID(videoUUID)
		if (_.isNull(imageUrl)) return res.status(500).json({ error: "Unable to find the video thumbnail/image" })

		const transformedVideoData = transformVideoAndImageData(videoData, imageUrl.image_url)

		return res.status(200).json({ video: transformedVideoData })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to get video by UUID" })
	}
}
