import express from "express"
import googleLoginAuthCallback from "../../controllers/auth/google-login-auth-callback"
import validateGoogleLoginAuthCallback from "../../middleware/request-validation/auth/validate-google-login-auth-callback"

const googleAuthRoutes = express.Router()

googleAuthRoutes.post("/login-callback", validateGoogleLoginAuthCallback, googleLoginAuthCallback)

export default googleAuthRoutes
