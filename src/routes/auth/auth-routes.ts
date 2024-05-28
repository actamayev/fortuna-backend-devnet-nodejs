import express from "express"

import googleAuthRoutes from "./google-auth-routes"

import login from "../../controllers/auth/login"
import logout from "../../controllers/auth/logout"
import register from "../../controllers/auth/register"
import registerUsername from "../../controllers/auth/register-username"

import jwtVerifyAttachUser from "../../middleware/jwt/jwt-verify-attach-user"
import validateLogin from "../../middleware/request-validation/auth/validate-login"
import validateRegister from "../../middleware/request-validation/auth/validate-register"
import validateRegisterUsername from "../../middleware/request-validation/auth/validate-register-username"

const authRoutes = express.Router()

authRoutes.post("/login", validateLogin, login)
authRoutes.post("/logout", logout)
authRoutes.post("/register", validateRegister, register)

authRoutes.post("/set-username", jwtVerifyAttachUser, validateRegisterUsername, registerUsername)

authRoutes.use("/google-auth", googleAuthRoutes)

export default authRoutes
