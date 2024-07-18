import { Request, Response } from "express"
import updateUnfeatureVideo from "../../db-operations/write/video/update-unfeature-video"

export default async function unfeatureVideo (req: Request, res: Response): Promise<Response> {
	try {
		const { videoIdToUnfeature } = req.body as { videoIdToUnfeature: number }

		await updateUnfeatureVideo(videoIdToUnfeature)

		return res.status(200).json({ success: "Video un-featured" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to un-feature video" })
	}
}
