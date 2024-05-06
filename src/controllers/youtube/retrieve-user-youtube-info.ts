import _ from "lodash"
import { Response, Request } from "express"
import SecretsManager from "../../classes/secrets-manager"
import retrieveYouTubeSubscriberCount from "../../utils/google/retrieve-youtube-subscriber-count"

export default async function retrieveUserYouTubeInfo (req: Request, res: Response): Promise<Response> {
	try {
		const { youtubeAccessToken } = req
		const subscriberCount = await retrieveYouTubeSubscriberCount(youtubeAccessToken)

		let isApprovedToBeCreator = false
		if (!_.isNull(subscriberCount)) {
			const minNumberYouTubeSubsToBeFortunaCreator = await SecretsManager.getInstance().getSecret(
				"MIN_NUMBER_YOUTUBE_SUBS_TO_BE_FORTUNA_CREATOR"
			)

			isApprovedToBeCreator = parseInt(minNumberYouTubeSubsToBeFortunaCreator, 10) <= subscriberCount
		}

		return res.status(200).json({
			userHasYouTubeAccessTokens: true,
			subscriberCount,
			isApprovedToBeCreator
		} as UserYouTubeData)
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to retrieve user YouTube info" })
	}
}
