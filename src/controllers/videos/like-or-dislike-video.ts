import { Request, Response } from "express"
import upsertVideoLikeStatus from "../../db-operations/write/video-like-status/upsert-video-like-status"

export default async function likeOrDislikeVideo(req: Request, res: Response): Promise<Response> {
	try {
		const { solanaWallet, minimalDataNeededToCheckForExclusiveContentAccess } = req
		const { likeStatus } = req.body

		await upsertVideoLikeStatus(minimalDataNeededToCheckForExclusiveContentAccess.video_id, solanaWallet.user_id, likeStatus)

		return res.status(200).json({ success: `Video ${likeStatus === true ? "Liked" : "Disliked" }` })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to like/dislike video" })
	}
}
