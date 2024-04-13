import express from "express"

import searchForUsername from "../controllers/search/search-for-username"
import checkIfPublicKeyExistsOnSolana from "../controllers/search/check-if-public-key-exists-on-solana"
import checkIfPublicKeyExistsWithFortuna from "../controllers/search/check-if-public-key-exists-with-fortuna"

import validatePublicKey from "../middleware/request-validation/search/validate-public-key"
import validateSearchUsername from "../middleware/request-validation/search/validate-search-username"

const searchRoutes = express.Router()

searchRoutes.get("/username/:username", validateSearchUsername, searchForUsername)
searchRoutes.get("/check-if-public-key-exists-with-fortuna/:publicKey", validatePublicKey, checkIfPublicKeyExistsWithFortuna)
searchRoutes.get("/check-if-public-key-exists-on-solana/:publicKey", validatePublicKey, checkIfPublicKeyExistsOnSolana)

export default searchRoutes
