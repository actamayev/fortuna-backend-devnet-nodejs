import _ from "lodash"
import { Request, Response, NextFunction } from "express"

export default function confirmUserHasntGivenYouTubeAccess(req: Request, res: Response, next: NextFunction): Response | void {
	try {
		const user = req.user
		if (!_.isNull(user.youtube_access_tokens_id)) {
			return res.status(400).json({ message: "User has already provided Youtube access" })
		}

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to check if user has already provided Youtube access" })
	}
}
