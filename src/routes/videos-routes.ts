import express from "express"

import getVideoByUUID from "../controllers/videos/get-video-by-uuid"
import getHomePageVideos from "../controllers/videos/get-home-page-videos"
import getVideosByCreatorUsername from "../controllers/videos/get-videos-by-creator-username"

import validateVideoUUID from "../middleware/request-validation/videos/validate-video-uuid"
import validateCreatorUsername from "../middleware/request-validation/videos/validate-creator-username"

const videosRoutes = express.Router()

videosRoutes.get("/get-home-page-videos", getHomePageVideos)
videosRoutes.get("/get-video/:videoUUID", validateVideoUUID, getVideoByUUID)
videosRoutes.get("/get-creator-videos/:creatorUsername", validateCreatorUsername, getVideosByCreatorUsername)

export default videosRoutes
