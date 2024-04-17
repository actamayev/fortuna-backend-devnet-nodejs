import express from "express"

import getVideoByUUID from "../controllers/videos/get-video-by-uuid"

import validateVideoUUID from "../middleware/request-validation/videos/validate-video-uuid"

const videosRoutes = express.Router()

videosRoutes.get("/get-video/:videoUUID", validateVideoUUID, getVideoByUUID)

export default videosRoutes
