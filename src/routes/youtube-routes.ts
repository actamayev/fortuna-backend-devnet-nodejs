import express from "express"

import retrieveUserYouTubeInfo from "../controllers/youtube/retrieve-user-youtube-info"

const youTubeRoutes = express.Router()

youTubeRoutes.get("/retrieve-user-youtube-info", retrieveUserYouTubeInfo)

export default youTubeRoutes
