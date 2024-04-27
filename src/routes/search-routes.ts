import express from "express"

import generalSearch from "../controllers/search/general-search"
import searchForUsername from "../controllers/search/search-for-username"
import checkIfPublicKeyExistsOnSolana from "../controllers/search/check-if-public-key-exists-on-solana"
import checkIfPublicKeyExistsWithFortuna from "../controllers/search/check-if-public-key-exists-with-fortuna"

import jwtVerify from "../middleware/jwt/jwt-verify"
import validatePublicKey from "../middleware/request-validation/search/validate-public-key"
import validateSearchTerm from "../middleware/request-validation/search/validate-search-term"
import validateSearchUsername from "../middleware/request-validation/search/validate-search-username"

const searchRoutes = express.Router()

searchRoutes.get(
	"/username/:username",
	jwtVerify,
	validateSearchUsername,
	searchForUsername
)
searchRoutes.get(
	"/check-if-public-key-exists-with-fortuna/:publicKey",
	jwtVerify,
	validatePublicKey,
	checkIfPublicKeyExistsWithFortuna
)
searchRoutes.get(
	"/check-if-public-key-exists-on-solana/:publicKey",
	jwtVerify,
	validatePublicKey,
	checkIfPublicKeyExistsOnSolana
)
searchRoutes.get("/general-search/:searchTerm", validateSearchTerm, generalSearch)

export default searchRoutes
