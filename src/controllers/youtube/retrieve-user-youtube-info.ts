import _ from "lodash"
import { Response, Request } from "express"
import retrieveYouTubeSubscriberCount from "../../utils/google/retrieve-youtube-subscriber-count"

export default async function retrieveUserYouTubeInfo (req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user
		const accessToken = req.youtubeAccessToken
		const subscriberCount = await retrieveYouTubeSubscriberCount(accessToken)

		let isApprovedToBeCreator = false
		if (!_.isNull(subscriberCount)) {
			isApprovedToBeCreator = Number(process.env.MIN_NUMBER_YOUTUBE_SUBS_TO_BE_FORTUNA_CREATOR) <= subscriberCount
		}

		return res.status(200).json({
			userHasYouTubeAccessTokens: !_.isNull(user.youtube_access_tokens_id),
			subscriberCount,
			isApprovedToBeCreator
		} as UserYouTubeData)
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to retrieve user YouTube info" })
	}
}
