import express from "express"

import setDefaultCurrency from "../controllers/personal-info/set-default-currency"
import setDefaultSiteTheme from "../controllers/personal-info/set-default-site-theme"
import retrievePersonalInfo from "../controllers/personal-info/retrieve-personal-info"

import validateSetDefaultCurrency from "../middleware/request-validation/personal-info/validate-set-default-currency"
import validateSetDefaultSiteTheme from "../middleware/request-validation/personal-info/validate-set-default-site-theme"

const personalInfoRoutes = express.Router()

personalInfoRoutes.get("/retrieve-personal-info", retrievePersonalInfo)
personalInfoRoutes.post("/set-default-currency/:defaultCurrency", validateSetDefaultCurrency, setDefaultCurrency)
personalInfoRoutes.post("/set-default-site-theme/:defaultSiteTheme", validateSetDefaultSiteTheme, setDefaultSiteTheme)

export default personalInfoRoutes
