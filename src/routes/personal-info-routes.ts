import express from "express"

import validateSetDefaultCurrency from "../middleware/request-validation/personal-info/validate-set-default-currency"

import setDefaultCurrency from "../controllers/personal-info/set-default-currency"
import retrievePersonalInfo from "../controllers/personal-info/retrieve-personal-info"

const personalInfoRoutes = express.Router()

personalInfoRoutes.get("/retrieve-personal-info", retrievePersonalInfo)
personalInfoRoutes.post("/set-default-currency/:defaultCurrency", validateSetDefaultCurrency, setDefaultCurrency)

export default personalInfoRoutes
