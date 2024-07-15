import { Request, Response } from "express"
import removeLike from "../../db-operations/write/video-like-status/remove-like-status"

export default async function removeLikeFromVideo(req: Request, res: Response): Promise<Response> {
	try {
		const { user, minimalDataNeededToCheckForExclusiveContentAccess } = req

		await removeLike(minimalDataNeededToCheckForExclusiveContentAccess.video_id, user.user_id)

		return res.status(200).json({ success: "Removed like from video" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to remove like from video" })
	}
}
