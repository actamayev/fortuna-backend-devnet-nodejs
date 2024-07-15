import { Request, Response } from "express"
import upsertVideoLike from "../../db-operations/write/video-like-status/upsert-video-like-status"

export default async function likeVideo(req: Request, res: Response): Promise<Response> {
	try {
		const { user, minimalDataNeededToCheckForExclusiveContentAccess } = req

		await upsertVideoLike(minimalDataNeededToCheckForExclusiveContentAccess.video_id, user.user_id)

		return res.status(200).json({ success: "Video Liked" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to like video" })
	}
}
