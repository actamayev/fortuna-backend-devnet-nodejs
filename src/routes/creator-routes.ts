import express from "express"

import createVideo from "../controllers/creator/create-video"
import retrieveCreatorInfo from "../controllers/creator/retrieve-creator-info"
import addOrEditChannelName from "../controllers/creator/add-or-edit-channel-name"
import getCreatorContentList from "../controllers/creator/get-creator-content-list"

import jwtVerifyAttachUser from "../middleware/jwt/jwt-verify-attach-user"
import validateCreateVideo from "../middleware/request-validation/creator/validate-create-video"
import validateAddOrEditChannelName from "../middleware/request-validation/creator/validate-add-or-edit-channel-name"

const creatorRoutes = express.Router()

creatorRoutes.post(
	"/create-video",
	validateCreateVideo,
	jwtVerifyAttachUser,
	createVideo
)

creatorRoutes.get("/get-creator-content-list", jwtVerifyAttachUser, getCreatorContentList)

creatorRoutes.post(
	"/add-or-edit-channel-name",
	validateAddOrEditChannelName,
	jwtVerifyAttachUser,
	addOrEditChannelName
)

creatorRoutes.get("/retrieve-creator-info", jwtVerifyAttachUser, retrieveCreatorInfo)

export default creatorRoutes
