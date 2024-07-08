import express from "express"

import createVideo from "../controllers/creator/create-video"
import editChannelName from "../controllers/creator/edit-channel-name"
import retrieveCreatorInfo from "../controllers/creator/retrieve-creator-info"
import getCreatorContentList from "../controllers/creator/get-creator-content-list"
import removeSocialPlatformLink from "../controllers/creator/remove-social-platform-link"
import removeCurrentProfilePicture from "../controllers/creator/remove-current-profile-picture"
import addOrEditChannelDescription from "../controllers/creator/add-or-edit-channel-description"
import addOrEditSocialPlatformLink from "../controllers/creator/add-or-edit-social-platform-link"
import removeCurrentChannelBannerPicture from "../controllers/creator/remove-current-channel-banner-picture"

import jwtVerifyAttachUser from "../middleware/jwt/jwt-verify-attach-user"
import validateCreateVideo from "../middleware/request-validation/creator/validate-create-video"
import validateAddOrEditChannelName from "../middleware/request-validation/creator/validate-edit-channel-name"
import validateAddOrEditChannelDescription from "../middleware/request-validation/creator/validate-add-or-edit-channel-description"
import validateAddOrEditSocialPlatformLink from "../middleware/request-validation/creator/validate-add-or-edit-social-platform-link"

const creatorRoutes = express.Router()

creatorRoutes.post(
	"/create-video",
	validateCreateVideo,
	jwtVerifyAttachUser,
	createVideo
)

creatorRoutes.get("/get-creator-content-list", jwtVerifyAttachUser, getCreatorContentList)

creatorRoutes.post(
	"/edit-channel-name",
	validateAddOrEditChannelName,
	jwtVerifyAttachUser,
	editChannelName
)

creatorRoutes.post(
	"/add-or-edit-channel-description",
	validateAddOrEditChannelDescription,
	jwtVerifyAttachUser,
	addOrEditChannelDescription
)

creatorRoutes.get("/retrieve-creator-info", jwtVerifyAttachUser, retrieveCreatorInfo)

creatorRoutes.post(
	"/add-or-edit-social-platform-link",
	validateAddOrEditSocialPlatformLink,
	jwtVerifyAttachUser,
	addOrEditSocialPlatformLink
)

creatorRoutes.post(
	"/remove-social-platform-link/:socialPlatform",
	jwtVerifyAttachUser,
	removeSocialPlatformLink
)

creatorRoutes.post("/remove-current-profile-picture", jwtVerifyAttachUser, removeCurrentProfilePicture)

creatorRoutes.post("/remove-current-channel-banner-picture", jwtVerifyAttachUser, removeCurrentChannelBannerPicture)

export default creatorRoutes
