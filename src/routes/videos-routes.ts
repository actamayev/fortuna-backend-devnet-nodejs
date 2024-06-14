import express from "express"

import getVideoUrl from "../controllers/videos/get-video-url"
import getVideoByUUID from "../controllers/videos/get-video-by-uuid"
import getHomePageVideos from "../controllers/videos/get-home-page-videos"
import likeOrDislikeVideo from "../controllers/videos/like-or-dislike-video"
import getVideosByCreatorUsername from "../controllers/videos/get-videos-by-creator-username"
import removeLikeOrDislikeFromVideo from "../controllers/videos/remove-like-or-dislike-from-video"

import jwtVerifyAttachUser from "../middleware/jwt/jwt-verify-attach-user"
import validateCreatorUsername from "../middleware/request-validation/videos/validate-creator-username"
import validateVideoUUIDInBody from "../middleware/request-validation/videos/validate-video-uuid-in-body"
import optionalJwtVerifyWithUserAttachment from "../middleware/jwt/optional-jwt-verify-with-user-attachment"
import validateVideoUUIDInParams from "../middleware/request-validation/videos/validate-video-uuid-in-params"
import validateLikeOrDislikeVideo from "../middleware/request-validation/videos/validate-like-or-dislike-video"
import confirmUserHasExclusiveAccess from "../middleware/confirmations/videos/confirm-user-has-exclusive-access"
import attachMinimalExclusiveVideoDataByUUID from "../middleware/attach/exclusive-video-data/attach-minimal-exclusive-video-data-by-uuid"

const videosRoutes = express.Router()

videosRoutes.get("/get-home-page-videos", optionalJwtVerifyWithUserAttachment, getHomePageVideos)

videosRoutes.get(
	"/get-video/:videoUUID",
	validateVideoUUIDInParams,
	optionalJwtVerifyWithUserAttachment,
	getVideoByUUID
)

videosRoutes.get(
	"/get-creator-videos/:creatorUsername",
	validateCreatorUsername,
	optionalJwtVerifyWithUserAttachment,
	getVideosByCreatorUsername
)

videosRoutes.get(
	"/get-video-url/:videoUUID",
	validateVideoUUIDInParams,
	optionalJwtVerifyWithUserAttachment,
	getVideoUrl
)

videosRoutes.post(
	"/like-or-dislike-video",
	validateLikeOrDislikeVideo,
	jwtVerifyAttachUser,
	attachMinimalExclusiveVideoDataByUUID,
	confirmUserHasExclusiveAccess,
	likeOrDislikeVideo
)

videosRoutes.post(
	"/remove-like-or-dislike-from-video",
	validateVideoUUIDInBody,
	jwtVerifyAttachUser,
	attachMinimalExclusiveVideoDataByUUID,
	confirmUserHasExclusiveAccess,
	removeLikeOrDislikeFromVideo
)

export default videosRoutes
