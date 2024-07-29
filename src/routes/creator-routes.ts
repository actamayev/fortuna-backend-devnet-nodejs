import express from "express"

import createVideo from "../controllers/creator/create-video"
import editVideoName from "../controllers/creator/edit-video-name"
import getCreatorInfo from "../controllers/creator/get-creator-info"
import editChannelName from "../controllers/creator/edit-channel-name"
import addTagToVideo from "../controllers/creator/video-tag/add-tag-to-video"
import getCreatorContentList from "../controllers/creator/get-creator-content-list"
import featureVideo from "../controllers/creator/feature-unfeature-video/feature-video"
import removeTagFromVideo from "../controllers/creator/video-tag/remove-tag-from-video"
import updateVideoListingStatus from "../controllers/creator/update-video-listing-status"
import unfeatureVideo from "../controllers/creator/feature-unfeature-video/unfeature-video"
import removeCurrentProfilePicture from "../controllers/creator/remove-current-profile-picture"
import editVideoDescription from "../controllers/creator/channel-description/edit-video-description"
import removeCurrentChannelBannerPicture from "../controllers/creator/remove-current-channel-banner-picture"
import removeSocialPlatformLink from "../controllers/creator/social-platform-link/remove-social-platform-link"
import addOrEditChannelDescription from "../controllers/creator/channel-description/add-or-edit-channel-description"
import addOrEditSocialPlatformLink from "../controllers/creator/social-platform-link/add-or-edit-social-platform-link"

import jwtVerifyAttachUser from "../middleware/jwt/jwt-verify-attach-user"
import { confirmCreatorOwnsVideoByIdInBody, confirmCreatorOwnsVideoByIdInParams }
	from "../middleware/confirmations/creator/confirm-creator-owns-video-by-id"
import validateCreateVideo from "../middleware/request-validation/creator/validate-create-video"
import validateAddVideoTag from "../middleware/request-validation/creator/validate-add-video-tag"
import validateFeatureVideo from "../middleware/request-validation/creator/validate-feature-video"
import validateEditVideoName from "../middleware/request-validation/creator/validate-edit-video-name"
import validateUnfeatureVideo from "../middleware/request-validation/creator/validate-unfeature-video"
import validateDeleteVideoTag from "../middleware/request-validation/creator/validate-delete-video-tag"
import attachNonExclusiveVideoDataById from "../middleware/attach/attach-non-exclusive-video-data-by-id"
import validateVideoIdInParams from "../middleware/request-validation/videos/validate-video-id-in-params"
import validateEditChannelName from "../middleware/request-validation/creator/validate-edit-channel-name"
import validateEditVideoDescription from "../middleware/request-validation/creator/validate-edit-video-description"
import confirmCreatorOwnsVideoToFeature from "../middleware/confirmations/creator/confirm-creator-owns-video-to-feature"
import confirmCreatorOwnsVideoToUnfeature from "../middleware/confirmations/creator/confirm-creator-owns-video-to-unfeature"
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
	"/update-video-listing-status/:videoId",
	validateVideoIdInParams,
	jwtVerifyAttachUser,
	confirmCreatorOwnsVideoByIdInParams,
	attachNonExclusiveVideoDataById,
	updateVideoListingStatus
)

creatorRoutes.post(
	"/edit-video-name",
	validateEditVideoName,
	jwtVerifyAttachUser,
	confirmCreatorOwnsVideoByIdInBody,
	editVideoName
)

creatorRoutes.post(
	"/edit-video-description",
	validateEditVideoDescription,
	jwtVerifyAttachUser,
	confirmCreatorOwnsVideoByIdInBody,
	editVideoDescription
)

creatorRoutes.post(
	"/feature-video",
	validateFeatureVideo,
	jwtVerifyAttachUser,
	confirmCreatorOwnsVideoToFeature,
	featureVideo
)

creatorRoutes.post(
	"/unfeature-video",
	validateUnfeatureVideo,
	jwtVerifyAttachUser,
	confirmCreatorOwnsVideoToUnfeature,
	unfeatureVideo
)

creatorRoutes.post(
	"/add-video-tag",
	validateAddVideoTag,
	jwtVerifyAttachUser,
	confirmCreatorOwnsVideoByIdInBody,
	addTagToVideo
)

creatorRoutes.post(
	"/delete-video-tag",
	validateDeleteVideoTag,
	jwtVerifyAttachUser,
	confirmCreatorOwnsVideoByIdInBody,
	removeTagFromVideo
)

export default creatorRoutes
