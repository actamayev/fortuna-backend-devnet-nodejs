import express from "express"

import retrieveUserYouTubeInfo from "../controllers/youtube/retrieve-user-youtube-info"

import jwtVerifyAttachUser from "../middleware/jwt/jwt-verify-attach-user"
import attachYouTubeAccessToken from "../middleware/attach/attach-youtube-access-token"

// Youtube endpoints are currently not accessible to client.
// Work on perfecting functionality, fix the bug that revokes the user's Youtube access token
const youtubeRoutes = express.Router()

youtubeRoutes.get(
	"/retrieve-user-youtube-info",
	jwtVerifyAttachUser,
	attachYouTubeAccessToken,
	retrieveUserYouTubeInfo
)

export default youtubeRoutes
