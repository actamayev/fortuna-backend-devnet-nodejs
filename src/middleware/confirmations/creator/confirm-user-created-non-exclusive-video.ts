import _ from "lodash"
import { Request, Response, NextFunction } from "express"

export default function confirmUserCreatedNonExclusiveVideo(req: Request, res: Response, next: NextFunction): Response | void {
	try {
		const { user, nonExclusiveVideoData } = req

		if (nonExclusiveVideoData.isVideoExclusive === true) {
			return res.status(400).json({ message: "This video is exclusive and it's listing status cannot be changed" })
		} else if (!_.isEqual(nonExclusiveVideoData.userId, user.user_id)) {
			return res.status(400).json({ message: "This user did not create this video" })
		}

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Check if user created non exclusive video" })
	}
}
