import { Request, Response } from "express"
import removeLikeStatus from "../../db-operations/write/video-like-status/remove-like-status"

export default async function removeLikeOrDislikeFromVideo(req: Request, res: Response): Promise<Response> {
	try {
		const { solanaWallet, minimalDataNeededToCheckForExclusiveContentAccess } = req

		await removeLikeStatus(minimalDataNeededToCheckForExclusiveContentAccess.video_id, solanaWallet.user_id)

		return res.status(200).json({ success: "Removed like/dislike from video" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to remove like/dislike from video" })
	}
}
