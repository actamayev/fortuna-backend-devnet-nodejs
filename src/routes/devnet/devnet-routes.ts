import express from "express"

import jwtVerify from "../../middleware/jwt/jwt-verify"

import authDevnetRoutes from "./auth-devnet-routes"
import uploadDevnetRoutes from "./upload-devnet-routes"
import solanaDevnetRoutes from "./solana-devnet-routes"
import searchDevnetRoutes from "./search-devnet-routes"

const devnetRoutes = express.Router()

devnetRoutes.use("/auth", authDevnetRoutes)
devnetRoutes.use("/search", jwtVerify, searchDevnetRoutes)
devnetRoutes.use("/solana", jwtVerify, solanaDevnetRoutes)
devnetRoutes.use("/upload", jwtVerify, uploadDevnetRoutes)

export default devnetRoutes
