import { Request, Response, NextFunction } from "express"
import checkIfCreatorOwnsVideoToUnfeature from "../../../db-operations/read/video/check-if-creator-owns-video-to-unfeature"

export default async function confirmCreatorOwnsVideoToUnfeature(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response | void> {
	try {
		const { user } = req
		const { videoIdToUnfeature } = req.body as { videoIdToUnfeature: number }

		const creatorOwnsVideoToUnfeature = await checkIfCreatorOwnsVideoToUnfeature(
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
