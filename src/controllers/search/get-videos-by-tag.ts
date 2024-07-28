import _ from "lodash"
import { Response, Request } from "express"
import retrieveVideosByTag from "../../db-operations/read/video-tag-lookup/retrieve-videos-by-tag"
import transformHomePageVideoData from "../../utils/transform/videos/transform-home-page-video-data"

export default async function getVideosByTag (req: Request, res: Response): Promise<Response> {
	try {
		const { optionallyAttachedUser } = req
		const videoTag = req.params.videoTag as string

		const retrievedVideoData = await retrieveVideosByTag(videoTag)
		if (_.isNull(retrievedVideoData)) return res.status(200).json([])

		const transformedVideoTagData = await transformHomePageVideoData(retrievedVideoData, optionallyAttachedUser)
		if (_.isNull(transformedVideoTagData)) {
			return res.status(400).json({ message: "Unable to find transformed videos associated with this tag"})
		}

		return res.status(200).json({ transformedVideoTagData })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to get videos by tag" })
	}
}
