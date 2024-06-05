import express from "express"

import createVideo from "../controllers/videos/create-video"

import jwtVerifyAttachUser from "../middleware/jwt/jwt-verify-attach-user"
import attachSolanaWalletByUserId from "../middleware/attach/attach-solana-wallet-by-user-id"
import validateCreateVideo from "../middleware/request-validation/videos/validate-create-video"
import getCreatorContentList from "../controllers/solana/get-creator-content-list"

const creatorRoutes = express.Router()

creatorRoutes.post(
	"/create-video",
	validateCreateVideo,
	jwtVerifyAttachUser,
	attachSolanaWalletByUserId,
	createVideo
)

creatorRoutes.get(
	"/get-creator-content-list",
	jwtVerifyAttachUser,
	attachSolanaWalletByUserId,
	getCreatorContentList
)

export default creatorRoutes
