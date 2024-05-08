import express from "express"

import hashString from "../controllers/encryption/hash-string"
import deterministicEncryption from "../controllers/encryption/deterministic-encryption"
import deterministicDecryption from "../controllers/encryption/deterministic-decryption"
import nonDeterministicEncryption from "../controllers/encryption/non-deterministic-encryption"
import nonDeterministicDecryption from "../controllers/encryption/non-deterministic-decryption"

import validateHashString from "../middleware/request-validation/encryption/validate-hash-string"
import validateEncryptionString from "../middleware/request-validation/encryption/validate-encryption-string"
import validateDecryptionString from "../middleware/request-validation/encryption/validate-decryption-string"

const encryptionRoutes = express.Router()

encryptionRoutes.post("/encrypt-deterministic-string", validateEncryptionString, deterministicEncryption)
encryptionRoutes.post("/decrypt-deterministic-string", validateDecryptionString, deterministicDecryption)

encryptionRoutes.post("/encrypt-nondeterministic-string", validateEncryptionString, nonDeterministicEncryption)
encryptionRoutes.post("/decrypt-nondeterministic-string", validateDecryptionString, nonDeterministicDecryption)

encryptionRoutes.post("/hash-string", validateHashString, hashString)

export default encryptionRoutes
