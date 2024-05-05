import express from "express"

import googleLoginAuthCallback from "../../controllers/auth/google-login-auth-callback"
import googleYouTubeAuthCallback from "../../controllers/auth/google-youtube-auth-callback"

import jwtVerify from "../../middleware/jwt/jwt-verify"
import validateYouTubeAuthCallback from "../../middleware/request-validation/auth/google/validate-youtube-auth-callback"
import confirmUserHasntGivenYouTubeAccess from "../../middleware/confirmations/google/confirm-user-hasnt-given-youtube-access"
import validateGoogleLoginAuthCallback from "../../middleware/request-validation/auth/google/validate-google-login-auth-callback"

const googleAuthRoutes = express.Router()

googleAuthRoutes.post("/login-callback", validateGoogleLoginAuthCallback, googleLoginAuthCallback)

googleAuthRoutes.post(
	"/youtube-callback",
	jwtVerify,
	validateYouTubeAuthCallback,
	confirmUserHasntGivenYouTubeAccess,
	googleYouTubeAuthCallback
)

export default googleAuthRoutes
