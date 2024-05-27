import express from "express"

import getVideoUrl from "../controllers/videos/get-video-url"
import getVideoByUUID from "../controllers/videos/get-video-by-uuid"
import getHomePageVideos from "../controllers/videos/get-home-page-videos"
import getVideosByCreatorUsername from "../controllers/videos/get-videos-by-creator-username"

import validateCreatorUsername from "../middleware/request-validation/videos/validate-creator-username"
import validateVideoUUIDInParams from "../middleware/request-validation/videos/validate-video-uuid-in-params"
import optionalJwtVerifyWithWalletAttachment from "../middleware/jwt/optional-jwt-verify-with-wallet-attachment"

const videosRoutes = express.Router()

videosRoutes.get("/get-home-page-videos", getHomePageVideos)

videosRoutes.get(
	"/get-video/:videoUUID",
	validateVideoUUIDInParams,
	optionalJwtVerifyWithWalletAttachment,
	getVideoByUUID
)
videosRoutes.get("/get-creator-videos/:creatorUsername", validateCreatorUsername, getVideosByCreatorUsername)

videosRoutes.get(
	"/get-video-url/:videoUUID",
	validateVideoUUIDInParams,
	optionalJwtVerifyWithWalletAttachment,
	getVideoUrl
)

export default videosRoutes
