import express from "express"

import validateLogin from "../middleware/request-validation/auth/validate-login"

import login from "../controllers/auth/login"

const authRoutes = express.Router()

authRoutes.post("/login", validateLogin, login)

export default authRoutes
