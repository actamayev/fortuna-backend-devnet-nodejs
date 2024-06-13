import express from "express"

import generalSearch from "../controllers/search/general-search"
import searchForUsername from "../controllers/search/search-for-username"
import checkIfPublicKeyExistsWithFortuna from "../controllers/search/check-if-public-key-exists-with-fortuna"

import jwtVerifyAttachUser from "../middleware/jwt/jwt-verify-attach-user"
import validatePublicKey from "../middleware/request-validation/search/validate-public-key"
import validateSearchTerm from "../middleware/request-validation/search/validate-search-term"
import validateSearchUsername from "../middleware/request-validation/search/validate-search-username"
import optionalJwtVerifyWithWalletAttachment from "../middleware/jwt/optional-jwt-verify-with-wallet-attachment"

const searchRoutes = express.Router()

searchRoutes.get(
	"/username/:username",
	validateSearchUsername,
	jwtVerifyAttachUser,
	searchForUsername
)

searchRoutes.get(
	"/check-if-public-key-exists-with-fortuna/:publicKey",
	validatePublicKey,
	jwtVerifyAttachUser,
	checkIfPublicKeyExistsWithFortuna
)

searchRoutes.get("/general-search/:searchTerm", validateSearchTerm, optionalJwtVerifyWithWalletAttachment, generalSearch)

export default searchRoutes
