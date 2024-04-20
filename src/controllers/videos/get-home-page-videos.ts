import { Response, Request } from "express"
// import retrieveAllVideos from "../../utils/db-operations/read/uploaded-video/retrieve-all-videos"

// TODO: Complete this
export default function getHomePageVideos (req: Request, res: Response): Response {
	try {
		// const videoData = await retrieveAllVideos()

		return res.status(200).json({ videoData: [] })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to get video by UUID" })
	}
}
