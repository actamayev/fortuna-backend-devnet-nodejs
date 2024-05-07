import _ from "lodash"
import { Request, Response, NextFunction } from "express"
import Encryptor from "../../classes/encryptor"
import refreshGoogleAccessToken from "../../utils/google/refresh-google-access-token"
import retrieveYouTubeAccessTokens from "../../db-operations/read/credentials/retrieve-youtube-access-tokens"

export default async function attachYouTubeAccessToken(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
	try {
		const { user } = req
		if (_.isNull(user.youtube_access_tokens_id)) {
			return res.status(400).json({ message: "User has not granted YouTube access" })
		}
		const retrievedYouTubeAccessTokenData = await retrieveYouTubeAccessTokens(user.user_id)
		if (_.isNull(retrievedYouTubeAccessTokenData)) {
			return res.status(500).json({ error: "Unable to retrieve YouTube Access Tokens" })
		}
		const now = new Date()
		req.youtubeAccessToken = retrievedYouTubeAccessTokenData.access_token
		if (retrievedYouTubeAccessTokenData.expiry_date < now) {
			const decryptedRefreshToken = await (new Encryptor()).decrypt(
				retrievedYouTubeAccessTokenData.refresh_token__encrypted,
				"YT_REFRESH_TOKEN_ENCRYPTION_KEY"
			)
			req.youtubeAccessToken = await refreshGoogleAccessToken(
				user.youtube_access_tokens_id, decryptedRefreshToken
			)
		}

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to check if Access Token is Expired" })
	}
}
