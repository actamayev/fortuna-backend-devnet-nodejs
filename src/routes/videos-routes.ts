import express from "express"

import getVideoByUUID from "../controllers/videos/get-video-by-uuid"
import getHomePageVideos from "../controllers/videos/get-home-page-videos"

import validateVideoUUID from "../middleware/request-validation/videos/validate-video-uuid"

const videosRoutes = express.Router()

videosRoutes.get("/get-home-page-videos", getHomePageVideos)
videosRoutes.get("/get-video/:videoUUID", validateVideoUUID, getVideoByUUID)

export default videosRoutes
