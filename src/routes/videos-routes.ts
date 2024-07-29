import express from "express"

import reportVideo from "../controllers/videos/report-video"
import getVideoUrl from "../controllers/videos/get-video-url"
import getVideoByUUID from "../controllers/videos/get-video-by-uuid"
import getHomePageData from "../controllers/videos/get-home-page-data"
import likeOrUnlikeVideo from "../controllers/videos/like-or-unlike-video"
import getRecentlyUploadedVideos from "../controllers/videos/get-recently-uploaded-videos"
import getVideosByCreatorUsername from "../controllers/videos/get-videos-by-creator-username"

import jwtVerifyAttachUser from "../middleware/jwt/jwt-verify-attach-user"
import validateReportVideo from "../middleware/request-validation/videos/validate-report-video"
import validateLikeOrUnlike from "../middleware/request-validation/videos/validate-like-or-unlike"
import validateCreatorUsername from "../middleware/request-validation/videos/validate-creator-username"
import optionalJwtVerifyWithUserAttachment from "../middleware/jwt/optional-jwt-verify-with-user-attachment"
import validateVideoUUIDInParams from "../middleware/request-validation/videos/validate-video-uuid-in-params"
import confirmUserHasExclusiveAccess from "../middleware/confirmations/videos/confirm-user-has-exclusive-access"
import confirmUserHasntAlreadyReportedVideo from "../middleware/confirmations/videos/confirm-user-hasnt-already-reported-video"
import attachMinimalExclusiveVideoDataById from "../middleware/attach/exclusive-video-data/attach-minimal-exclusive-video-data-by-id"

const videosRoutes = express.Router()

videosRoutes.get("/get-home-page-data", optionalJwtVerifyWithUserAttachment, getHomePageData)

videosRoutes.get("/get-recently-uploaded-videos", optionalJwtVerifyWithUserAttachment, getRecentlyUploadedVideos)

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
	"/like-or-unlike-video",
	validateLikeOrUnlike,
	jwtVerifyAttachUser,
	attachMinimalExclusiveVideoDataById,
	confirmUserHasExclusiveAccess,
	likeOrUnlikeVideo
)

videosRoutes.post(
	"/report-video",
	validateReportVideo,
	jwtVerifyAttachUser,
	confirmUserHasntAlreadyReportedVideo,
	attachMinimalExclusiveVideoDataById,
	confirmUserHasExclusiveAccess,
	reportVideo
)

export default videosRoutes
