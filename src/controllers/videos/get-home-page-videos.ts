import { Response, Request } from "express"
import transformHomePageVideoData from "../../utils/transform/transform-home-page-video-data"
import retrieveHomePageVideos from "../../utils/db-operations/read/uploaded-video/retrieve-home-page-videos"

export default async function getHomePageVideos (req: Request, res: Response): Promise<Response> {
	try {
		const videoData = await retrieveHomePageVideos()

		const homePageVideos = await transformHomePageVideoData(videoData)

		return res.status(200).json({ homePageVideos })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to get home page videos" })
	}
}
