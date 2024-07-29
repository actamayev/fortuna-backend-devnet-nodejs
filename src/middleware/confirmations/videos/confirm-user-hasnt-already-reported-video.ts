import { Request, Response, NextFunction } from "express"
import checkIfUserReportedVideo from "../../../db-operations/read/reported-video/check-if-user-reported-video"

export default async function confirmUserHasntAlreadyReportedVideo(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response | void> {
	try {
		const { user } = req
		const { videoId } = req.body as { videoId: number }
		const userReportedVideo = await checkIfUserReportedVideo(user.user_id, videoId)

		if (userReportedVideo === true) {
			return res.status(400).json({ message: "User has already reported this video" })
		}
		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Check if user has already reported video" })
	}
}
