import { Request, Response } from "express"
import updateLikeStatus from "../../db-operations/write/video-like-status/update-like-status"

export default async function likeOrUnlikeVideo(req: Request, res: Response): Promise<Response> {
	try {
		const { user, minimalDataNeededToCheckForExclusiveContentAccess } = req
		const { newLikeStatus } = req.body

		await updateLikeStatus(minimalDataNeededToCheckForExclusiveContentAccess.video_id, user.user_id, newLikeStatus)

		return res.status(200).json({ success: "Video Like status updated" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to update like status" })
	}
}
