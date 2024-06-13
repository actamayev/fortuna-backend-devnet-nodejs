import express from "express"

import getVideoUrl from "../controllers/videos/get-video-url"
import getVideoByUUID from "../controllers/videos/get-video-by-uuid"
import getHomePageVideos from "../controllers/videos/get-home-page-videos"
import likeOrDislikeVideo from "../controllers/videos/like-or-dislike-to-video"
import getVideosByCreatorUsername from "../controllers/videos/get-videos-by-creator-username"
import removeLikeOrDislikeFromVideo from "../controllers/videos/remove-like-or-dislike-from-video"

import jwtVerifyAttachUser from "../middleware/jwt/jwt-verify-attach-user"
import jwtVerifyAttachSolanaWallet from "../middleware/jwt/jwt-verify-attach-solana-wallet"
import validateVideoIdInParams from "../middleware/request-validation/videos/validate-video-in-params"
import validateCreatorUsername from "../middleware/request-validation/videos/validate-creator-username"
import validateVideoUUIDInParams from "../middleware/request-validation/videos/validate-video-uuid-in-params"
import validateLikeOrDislikeVideo from "../middleware/request-validation/videos/validate-like-or-dislike-video"
import optionalJwtVerifyWithWalletAttachment from "../middleware/jwt/optional-jwt-verify-with-wallet-attachment"
import confirmUserHasExclusiveAccess from "../middleware/confirmations/videos/confirm-user-has-exclusive-access"
import attachExclusiveVideoDataById from "../middleware/attach/exclusive-video-data/attach-exclusive-video-data-by-id"

const videosRoutes = express.Router()

videosRoutes.get("/get-home-page-videos", optionalJwtVerifyWithWalletAttachment, getHomePageVideos)

videosRoutes.get(
	"/get-video/:videoUUID",
	validateVideoUUIDInParams,
	optionalJwtVerifyWithWalletAttachment,
	getVideoByUUID
)

videosRoutes.get(
	"/get-creator-videos/:creatorUsername",
	validateCreatorUsername,
	optionalJwtVerifyWithWalletAttachment,
	getVideosByCreatorUsername
)

videosRoutes.get(
	"/get-video-url/:videoUUID",
	validateVideoUUIDInParams,
	optionalJwtVerifyWithWalletAttachment,
	getVideoUrl
)

videosRoutes.post(
	"/like-or-dislike-video",
	validateLikeOrDislikeVideo,
	jwtVerifyAttachSolanaWallet,
	attachExclusiveVideoDataById,
	confirmUserHasExclusiveAccess,
	likeOrDislikeVideo
)

videosRoutes.post(
	"/remove-like-or-dislike-from-video/:videoId",
	validateVideoIdInParams,
	jwtVerifyAttachUser,
	removeLikeOrDislikeFromVideo
)

export default videosRoutes
