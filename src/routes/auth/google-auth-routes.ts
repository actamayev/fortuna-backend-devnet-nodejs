import express from "express"

import youtubeAuthCallback from "../../controllers/auth/youtube-auth-callback"
import googleLoginAuthCallback from "../../controllers/auth/google-login-auth-callback"

import jwtVerifyAttachUser from "../../middleware/jwt/jwt-verify-attach-user"
import validateYouTubeAuthCallback from "../../middleware/request-validation/auth/google/validate-youtube-auth-callback"
import validateGoogleLoginAuthCallback from "../../middleware/request-validation/auth/google/validate-google-login-auth-callback"

const googleAuthRoutes = express.Router()

googleAuthRoutes.post("/login-callback", validateGoogleLoginAuthCallback, googleLoginAuthCallback)

googleAuthRoutes.post(
	"/youtube-callback",
	validateYouTubeAuthCallback,
	jwtVerifyAttachUser,
	youtubeAuthCallback
)

export default googleAuthRoutes
