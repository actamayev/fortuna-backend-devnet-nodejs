import express from "express"

import retrieveUserYouTubeInfo from "../controllers/youtube/retrieve-user-youtube-info"

const youtubeRoutes = express.Router()

youtubeRoutes.get("/retrieve-user-youtube-info", retrieveUserYouTubeInfo)

export default youtubeRoutes
