import express from "express"

import validateVideoUUID from "../middleware/request-validation/videos/validate-video-uuid"

import getVideoByUUID from "../controllers/videos/get-video-by-uuid"

const videosRoutes = express.Router()

videosRoutes.get("/get-video/:videoUUID", validateVideoUUID, getVideoByUUID)

export default videosRoutes
