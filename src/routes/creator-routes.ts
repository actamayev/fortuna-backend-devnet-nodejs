import express from "express"

import createVideo from "../controllers/creator/create-video"
import getCreatorContentList from "../controllers/creator/get-creator-content-list"

import jwtVerifyAttachUser from "../middleware/jwt/jwt-verify-attach-user"
import validateCreateVideo from "../middleware/request-validation/videos/validate-create-video"

const creatorRoutes = express.Router()

creatorRoutes.post(
	"/create-video",
	validateCreateVideo,
	jwtVerifyAttachUser,
	createVideo
)

creatorRoutes.get("/get-creator-content-list", jwtVerifyAttachUser, getCreatorContentList)

export default creatorRoutes
