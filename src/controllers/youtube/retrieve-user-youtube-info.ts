import _ from "lodash"
import { Response, Request } from "express"

export default function retrieveUserYouTubeInfo (req: Request, res: Response): Response {
	try {
		const user = req.user

		return res.status(200).json({ userHasYouTubeAccessTokens: !_.isNull(user.youtube_access_tokens_id) })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to get home page videos" })
	}
}
