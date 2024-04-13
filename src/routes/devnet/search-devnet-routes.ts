import express from "express"

import searchForUsername from "../../controllers/search/search-for-username"
import checkIfPublicKeyExistsWithFortuna from "../../controllers/search/check-if-public-key-exists-with-fortuna"
import checkIfPublicKeyExistsOnSolanaDevnet from "../../controllers/search/check-if-public-key-exists-on-solana-devnet"

import validatePublicKey from "../../middleware/request-validation/search/validate-public-key"
import validateSearchUsername from "../../middleware/request-validation/search/validate-search-username"

const searchDevnetRoutes = express.Router()

searchDevnetRoutes.get("/username/:username", validateSearchUsername, searchForUsername)
searchDevnetRoutes.get("/check-if-public-key-exists-with-fortuna/:publicKey", validatePublicKey, checkIfPublicKeyExistsWithFortuna)
searchDevnetRoutes.get("/check-if-public-key-exists-on-solana/:publicKey", validatePublicKey, checkIfPublicKeyExistsOnSolanaDevnet)

export default searchDevnetRoutes
