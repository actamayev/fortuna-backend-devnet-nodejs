import { Response, Request } from "express"
import retrieveHomePageVideos from "../../db-operations/read/video/retrieve-home-page-videos"
import transformHomePageVideoData from "../../utils/transform/videos/transform-home-page-video-data"

export default async function getHomePageVideos (req: Request, res: Response): Promise<Response> {
	try {
		const { optionallyAttachedSolanaWallet } = req
		const videoData = await retrieveHomePageVideos()

		const homePageVideos = await transformHomePageVideoData(videoData, optionallyAttachedSolanaWallet)

		return res.status(200).json({ homePageVideos })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to get home page videos" })
	}
}
