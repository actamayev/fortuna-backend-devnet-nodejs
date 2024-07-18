import { Request, Response } from "express"
import updateVideoFeatureStatuses from "../../db-operations/write/video/update-video-feature-statuses"

export default async function featureVideo (req: Request, res: Response): Promise<Response> {
	try {
		const { videoIdToFeature, videoIdToUnfeature } = req.body as { videoIdToFeature: number, videoIdToUnfeature?: number }

		await updateVideoFeatureStatuses(videoIdToFeature, videoIdToUnfeature)

		return res.status(200).json({ success: "Video featured" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to feature video" })
	}
}
