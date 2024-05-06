import _ from "lodash"
import { Request, Response } from "express"
import SecretsManager from "../../classes/secrets-manager"
import createGoogleAuthClient from "../../utils/google/create-google-auth-client"
import retrieveYouTubeSubscriberCount from "../../utils/google/retrieve-youtube-subscriber-count"
import approveUserToBeCreator from "../../utils/db-operations/write/credentials/approve-user-to-be-creator"
import addYouTubeAccessTokenRecord
	from "../../utils/db-operations/write/simultaneous-writes/add-youtube-access-token-record-and-update-user"

export default async function youtubeAuthCallback(req: Request, res: Response): Promise<Response> {
	try {
		const { user } = req
		const { code } = req.body
		const client = await createGoogleAuthClient()
		const { tokens } = await client.getToken(code)

		if (
			_.isNil(tokens.access_token) ||
			_.isNil(tokens.refresh_token) ||
			_.isNil(tokens.expiry_date)
		) return res.status(500).json({ error: "Unable to extract token information" })

		await addYouTubeAccessTokenRecord(user.user_id, tokens.access_token, tokens.refresh_token, tokens.expiry_date)

		const subscriberCount = await retrieveYouTubeSubscriberCount(tokens.access_token)
		let isApprovedToBeCreator = false
		if (!_.isNull(subscriberCount)) {
			const minYouTubeSubsToBeFortunaCreator = await SecretsManager.getInstance().getSecret(
				"MIN_NUMBER_YOUTUBE_SUBS_TO_BE_FORTUNA_CREATOR"
			)
			isApprovedToBeCreator = parseInt(minYouTubeSubsToBeFortunaCreator, 10) <= subscriberCount
			if (isApprovedToBeCreator === true) await approveUserToBeCreator(user.user_id)
		}

		return res.status(200).json({
			subscriberCount: subscriberCount || 0,
			isApprovedToBeCreator
		} as UserYouTubeData)
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Login with YouTube" })
	}
}
