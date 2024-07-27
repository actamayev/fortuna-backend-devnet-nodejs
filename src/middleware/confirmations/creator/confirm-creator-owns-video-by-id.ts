import { Request, Response, NextFunction } from "express"
import checkIfCreatorOwnsVideo from "../../../db-operations/read/video/check-if-creator-owns-video"

export default async function confirmCreatorOwnsVideoById(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response | void> {
	try {
		const { user } = req
		const { videoId } = req.body as { videoId: number }

		const creatorOwnsVideo = await checkIfCreatorOwnsVideo(videoId, user.user_id)

		if (creatorOwnsVideo === false) {
			return res.status(500).json({ error: "Creator does not own the video they are trying to add a tag to"})
		}
		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to confirm that creator owns the video they want to tag" })
	}
}
