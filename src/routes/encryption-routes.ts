import express from "express"

import hashString from "../controllers/encryption/hash-string"
import encryptString from "../controllers/encryption/encrypt-string"
import decryptString from "../controllers/encryption/decrypt-string"

import validateHashString from "../middleware/request-validation/encryption/validate-hash-string"
import validateEncryptionString from "../middleware/request-validation/encryption/validate-encryption-string"
import validateDecryptionString from "../middleware/request-validation/encryption/validate-decryption-string"

const encryptionRoutes = express.Router()

encryptionRoutes.post("/encrypt-string", validateEncryptionString, encryptString)
encryptionRoutes.post("/decrypt-string", validateDecryptionString, decryptString)

encryptionRoutes.post("/hash-string", validateHashString, hashString)

export default encryptionRoutes
