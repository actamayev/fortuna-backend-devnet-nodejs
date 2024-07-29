import { Request, Response, NextFunction } from "express"
import checkIfCreatorOwnsVideo from "../../../db-operations/read/video/check-if-creator-owns-video"

export async function confirmCreatorOwnsVideoByIdInBody(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response | void> {
	try {
		const { user } = req
		const { videoId } = req.body as { videoId: number }

		const creatorOwnsVideo = await checkIfCreatorOwnsVideo(videoId, user.user_id)

		if (creatorOwnsVideo === false) {
			return res.status(500).json({ error: "Creator does not own the video videoID body"})
		}
		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to confirm that creator owns the video videoID body" })
	}
}

export async function confirmCreatorOwnsVideoByIdInParams(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response | void> {
	try {
		const { user } = req
		const { videoId } = req.params

		const creatorOwnsVideo = await checkIfCreatorOwnsVideo(Number(videoId), user.user_id)

		if (creatorOwnsVideo === false) {
			return res.status(500).json({ error: "Creator does not own the video videoID params" })
		}
		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to confirm that creator owns the video videoID params" })
	}
}
