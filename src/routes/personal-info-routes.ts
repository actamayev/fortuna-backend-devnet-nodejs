import express from "express"

import retrievePersonalInfo from "../controllers/personal-info/retrieve-personal-info"

const personalInfoRoutes = express.Router()

personalInfoRoutes.get("/retrieve-personal-info", retrievePersonalInfo)

export default personalInfoRoutes
