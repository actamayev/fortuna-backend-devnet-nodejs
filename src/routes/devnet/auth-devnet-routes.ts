import express from "express"

import login from "../../controllers/auth/login"
import logout from "../../controllers/auth/logout"
import register from "../../controllers/auth/register"

import validateLogin from "../../middleware/request-validation/auth/validate-login"
import validateRegister from "../../middleware/request-validation/auth/validate-register"

const authDevnetRoutes = express.Router()

authDevnetRoutes.post("/login", validateLogin, login)
authDevnetRoutes.post("/logout", logout)
authDevnetRoutes.post("/register", validateRegister, register)

export default authDevnetRoutes
