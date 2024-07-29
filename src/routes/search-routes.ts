import express from "express"

import generalSearch from "../controllers/search/general-search"
import getVideosByTag from "../controllers/search/get-videos-by-tag"
import searchForUsername from "../controllers/search/search-for-username"
import checkIfPublicKeyExistsWithFortuna from "../controllers/search/check-if-public-key-exists-with-fortuna"

import jwtVerifyAttachUser from "../middleware/jwt/jwt-verify-attach-user"
import validateVideoTag from "../middleware/request-validation/search/validate-video-tag"
import validatePublicKey from "../middleware/request-validation/search/validate-public-key"
import validateSearchTerm from "../middleware/request-validation/search/validate-search-term"
import validateSearchUsername from "../middleware/request-validation/search/validate-search-username"
import optionalJwtVerifyWithUserAttachment from "../middleware/jwt/optional-jwt-verify-with-user-attachment"

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

searchRoutes.get(
	"/general-search/:searchTerm",
	validateSearchTerm,
	optionalJwtVerifyWithUserAttachment,
	generalSearch
)

searchRoutes.get(
	"/get-videos-by-tag/:videoTag",
	validateVideoTag,
	optionalJwtVerifyWithUserAttachment,
	getVideosByTag
)

export default searchRoutes
