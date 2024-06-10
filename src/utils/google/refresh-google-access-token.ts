import _ from "lodash"
import createGoogleAuthClient from "./create-google-auth-client"
import updateYouTubeAccessToken from "../../db-operations/write/youtube-access-tokens/update-youtube-access-token"

export default async function refreshGoogleAccessToken(youtubeAccessTokensId: number, refreshToken: string): Promise<string> {
	try {
		const oauth2Client = await createGoogleAuthClient()
		oauth2Client.setCredentials({
			refresh_token: refreshToken
		})

		const { credentials } = await oauth2Client.refreshAccessToken()

		if (
			_.isNil(credentials.access_token) ||
			_.isNil(credentials.expiry_date)
		) throw Error("Unable to refresh access token")

		return await updateYouTubeAccessToken(youtubeAccessTokensId, credentials)
	} catch (error) {
		console.error(error)
		throw error
	}
}
