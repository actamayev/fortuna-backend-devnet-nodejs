import _ from "lodash"
import { Request, Response } from "express"
import createGoogleAuthClient from "../../utils/google/create-google-auth-client"
import addYoutubeAccessTokenRecord
	from "../../utils/db-operations/write/simultaneous-writes/add-youtube-access-token-record-and-update-user"

export default async function googleYouTubeAuthCallback(req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user
		const { code } = req.body
		const client = createGoogleAuthClient()
		const { tokens } = await client.getToken(code)

		if (
			_.isNil(tokens.access_token) ||
			_.isNil(tokens.refresh_token) ||
			_.isNil(tokens.expiry_date)
		) return res.status(500).json({ error: "Unable to extract token information" })

		await addYoutubeAccessTokenRecord(user.user_id, tokens.access_token, tokens.refresh_token, tokens.expiry_date)

		return res.status(200).json({ success: "YouTube Auth access granted" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Login with YouTube" })
	}
}
