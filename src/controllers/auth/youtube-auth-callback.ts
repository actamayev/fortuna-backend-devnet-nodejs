import _ from "lodash"
import { Request, Response } from "express"
import Encryptor from "../../classes/encryptor"
import createGoogleAuthClient from "../../utils/google/create-google-auth-client"
import retrieveYouTubeSubscriberCount from "../../utils/google/retrieve-youtube-subscriber-count"
import addYouTubeAccessTokenRecord from "../../db-operations/write/simultaneous-writes/add-youtube-access-token-record-and-update-user"

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

		const encryptor = new Encryptor()
		const encryptedRefreshToken = await encryptor.nonDeterministicEncrypt(tokens.refresh_token, "YT_REFRESH_TOKEN_ENCRYPTION_KEY")
		await addYouTubeAccessTokenRecord(user.user_id, tokens.access_token, encryptedRefreshToken, tokens.expiry_date)

		const subscriberCount = await retrieveYouTubeSubscriberCount(tokens.access_token)

		return res.status(200).json({ subscriberCount: subscriberCount || 0 })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Login with YouTube" })
	}
}
