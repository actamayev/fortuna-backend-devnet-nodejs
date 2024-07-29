import { Request, Response } from "express"
import updateVideoDescription from "../../../db-operations/write/video/update-video-description"

export default async function editVideoDescription (req: Request, res: Response): Promise<Response> {
	try {
		const { videoDescription, videoId } = req.body

		await updateVideoDescription(videoId, videoDescription)

		return res.status(200).json({ success: "Edited Video description" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Edit Video description" })
	}
}
