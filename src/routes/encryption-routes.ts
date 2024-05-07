import express from "express"

import encryptString from "../controllers/encryption/encrypt-string"
import decryptString from "../controllers/encryption/decrypt-string"

import validateEncryptionString from "../middleware/request-validation/encryption/validate-encryption-string"
import validateDecryptionString from "../middleware/request-validation/encryption/validate-decryption-string"


const encryptionRoutes = express.Router()

encryptionRoutes.post("/encrypt-string", validateEncryptionString, encryptString)
encryptionRoutes.post("/decrypt-string", validateDecryptionString, decryptString)

export default encryptionRoutes
