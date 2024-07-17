import express from "express"

import getUserYouTubeInfo from "../controllers/youtube/get-user-youtube-info"

import jwtVerifyAttachUser from "../middleware/jwt/jwt-verify-attach-user"
import attachYouTubeAccessToken from "../middleware/attach/attach-youtube-access-token"

// Youtube endpoints are currently not accessible to client.
// Work on perfecting functionality, fix the bug that revokes the user's Youtube access token
const youtubeRoutes = express.Router()

youtubeRoutes.get(
	"/get-user-youtube-info",
	jwtVerifyAttachUser,
	attachYouTubeAccessToken,
	getUserYouTubeInfo
)

export default youtubeRoutes
