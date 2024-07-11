import _ from "lodash"
import { Request, Response, NextFunction } from "express"

export default function confirmUserCreatedNonExclusiveVideo(req: Request, res: Response, next: NextFunction): Response | void {
	try {
		const { user, nonExclusiveVideoData } = req

		if (!_.isEqual(nonExclusiveVideoData.creator_user_id, user.user_id)) {
			return res.status(400).json({ message: "This user did not create this video" })
		}

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Check if user created non exclusive video" })
	}
}
