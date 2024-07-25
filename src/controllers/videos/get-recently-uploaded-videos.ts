import { Response, Request } from "express"
import transformHomePageVideoData from "../../utils/transform/videos/transform-home-page-video-data"
import retrieveRecentlyUploadedVideos from "../../db-operations/read/video/retrieve-recently-uploaded-videos"

export default async function getRecentlyUploadedVideos (req: Request, res: Response): Promise<Response> {
	try {
		const { optionallyAttachedUser } = req
		const recentlyUploadedVideos = await retrieveRecentlyUploadedVideos()

		const recentlyPostedVideos = await transformHomePageVideoData(recentlyUploadedVideos, optionallyAttachedUser)

		return res.status(200).json({ recentlyPostedVideos })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to get recently uploaded videos" })
	}
}
