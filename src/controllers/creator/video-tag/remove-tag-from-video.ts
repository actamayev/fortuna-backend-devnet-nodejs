import { Request, Response } from "express"
import markVideoTagInactive from "../../../db-operations/write/video-tag-mapping/mark-video-tag-inactive"

export default async function removeTagFromVideo (req: Request, res: Response): Promise<Response> {
	try {
		const { videoId, videoTagId } = req.body

		await markVideoTagInactive(videoId, videoTagId)

		return res.status(200).json({ success: "Removed Tag from video" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to remove tag from video" })
	}
}
