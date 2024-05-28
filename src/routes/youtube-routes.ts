import express from "express"

import retrieveUserYouTubeInfo from "../controllers/youtube/retrieve-user-youtube-info"

import attachYouTubeAccessToken from "../middleware/attach/attach-youtube-access-token"

const youtubeRoutes = express.Router()

youtubeRoutes.get("/retrieve-user-youtube-info", attachYouTubeAccessToken, retrieveUserYouTubeInfo)

export default youtubeRoutes
