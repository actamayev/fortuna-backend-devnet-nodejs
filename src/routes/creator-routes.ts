import express from "express"

import createVideo from "../controllers/creator/create-video"
import editVideoName from "../controllers/creator/edit-video-name"
import getCreatorInfo from "../controllers/creator/get-creator-info"
import editChannelName from "../controllers/creator/edit-channel-name"
import editVideoDescription from "../controllers/creator/edit-video-description"
import getCreatorContentList from "../controllers/creator/get-creator-content-list"
import updateVideoListingStatus from "../controllers/creator/update-video-listing-status"
import removeSocialPlatformLink from "../controllers/creator/remove-social-platform-link"
import removeCurrentProfilePicture from "../controllers/creator/remove-current-profile-picture"
import addOrEditChannelDescription from "../controllers/creator/add-or-edit-channel-description"
import addOrEditSocialPlatformLink from "../controllers/creator/add-or-edit-social-platform-link"
import removeCurrentChannelBannerPicture from "../controllers/creator/remove-current-channel-banner-picture"

import attachVideoByUUID from "../middleware/attach/attach-video-by-uuid"
import jwtVerifyAttachUser from "../middleware/jwt/jwt-verify-attach-user"
import validateCreateVideo from "../middleware/request-validation/creator/validate-create-video"
import validateEditVideoName from "../middleware/request-validation/creator/validate-edit-video-name"
import attachNonExclusiveVideoDataByUUID from "../middleware/attach/attach-non-exclusive-video-by-uuid"
import validateEditChannelName from "../middleware/request-validation/creator/validate-edit-channel-name"
import validateVideoUUIDInParams from "../middleware/request-validation/videos/validate-video-uuid-in-params"
import validateEditVideoDescription from "../middleware/request-validation/creator/validate-edit-video-description"
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
	validateEditChannelName,
	jwtVerifyAttachUser,
	editChannelName
)

creatorRoutes.post(
	"/add-or-edit-channel-description",
	validateAddOrEditChannelDescription,
	jwtVerifyAttachUser,
	addOrEditChannelDescription
)

creatorRoutes.get("/get-creator-info", jwtVerifyAttachUser, getCreatorInfo)

creatorRoutes.post(
	"/add-or-edit-social-platform-link",
	validateAddOrEditSocialPlatformLink,
	jwtVerifyAttachUser,
	addOrEditSocialPlatformLink
)

creatorRoutes.post("/remove-social-platform-link/:socialPlatform", jwtVerifyAttachUser, removeSocialPlatformLink)

creatorRoutes.post("/remove-current-profile-picture", jwtVerifyAttachUser, removeCurrentProfilePicture)

creatorRoutes.post("/remove-current-channel-banner-picture", jwtVerifyAttachUser, removeCurrentChannelBannerPicture)

creatorRoutes.post(
	"/update-video-listing-status/:videoUUID",
	validateVideoUUIDInParams,
	jwtVerifyAttachUser,
	attachNonExclusiveVideoDataByUUID,
	updateVideoListingStatus
)

creatorRoutes.post(
	"/edit-video-name",
	validateEditVideoName,
	jwtVerifyAttachUser,
	attachVideoByUUID,
	editVideoName
)

creatorRoutes.post(
	"/edit-video-description",
	validateEditVideoDescription,
	jwtVerifyAttachUser,
	attachVideoByUUID,
	editVideoDescription
)

export default creatorRoutes
