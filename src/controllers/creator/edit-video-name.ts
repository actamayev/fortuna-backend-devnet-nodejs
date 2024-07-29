import { Request, Response } from "express"
import updateVideoName from "../../db-operations/write/video/update-video-name"

export default async function editVideoName (req: Request, res: Response): Promise<Response> {
	try {
		const { videoName, videoId } = req.body

		await updateVideoName(videoId, videoName)

		return res.status(200).json({ success: "Edited Video name" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Edit Video Name" })
	}
}
