import { Request, Response, NextFunction } from "express"
import checkIfCreatorOwnsVideo from "../../../db-operations/read/video/check-if-creator-owns-video"

export default async function confirmCreatorOwnsVideoToUnfeature(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response | void> {
	try {
		const { user } = req
		const { videoIdToUnfeature } = req.body as { videoIdToUnfeature: number }

		const creatorOwnsVideoToUnfeature = await checkIfCreatorOwnsVideo(
			videoIdToUnfeature,
			user.user_id
		)

		if (creatorOwnsVideoToUnfeature === false) {
			return res.status(500).json({ error: "Creator does not own the video they are trying to unfeature" })
		}
		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({
			error: "Internal Server Error: Unable to confirm that creator owns the video they are trying to unfeature"
		})
	}
}
