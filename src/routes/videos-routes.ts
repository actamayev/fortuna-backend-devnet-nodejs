import express from "express"

import createVideo from "../controllers/videos/create-video"
import getVideoUrl from "../controllers/videos/get-video-url"
import getVideoByUUID from "../controllers/videos/get-video-by-uuid"
import getHomePageVideos from "../controllers/videos/get-home-page-videos"
import getVideosByCreatorUsername from "../controllers/videos/get-videos-by-creator-username"

import jwtVerifyAttachUser from "../middleware/jwt/jwt-verify-attach-user"
import attachSolanaWalletByUserId from "../middleware/attach/attach-solana-wallet-by-user-id"
import validateCreateVideo from "../middleware/request-validation/videos/validate-create-video"
import validateCreatorUsername from "../middleware/request-validation/videos/validate-creator-username"
import validateVideoUUIDInParams from "../middleware/request-validation/videos/validate-video-uuid-in-params"
import optionalJwtVerifyWithWalletAttachment from "../middleware/jwt/optional-jwt-verify-with-wallet-attachment"

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
	"/create-video",
	validateCreateVideo,
	jwtVerifyAttachUser,
	attachSolanaWalletByUserId,
	createVideo
)

export default videosRoutes
