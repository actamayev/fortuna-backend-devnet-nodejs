import express from "express"

import hashString from "../controllers/encryption/hash-string"
import deterministicEncryption from "../controllers/encryption/deterministic-encryption"
import decryptDeterministicString from "../controllers/encryption/deterministic-decryption"
import nonDeterministicEncryption from "../controllers/encryption/non-deterministic-encryption"
import decryptNonDeterministicString from "../controllers/encryption/non-deterministic-decryption"

import validateHashString from "../middleware/request-validation/encryption/validate-hash-string"
import validateEncryptionString from "../middleware/request-validation/encryption/validate-encryption-string"
import validateDecryptionString from "../middleware/request-validation/encryption/validate-decryption-string"

const encryptionRoutes = express.Router()

encryptionRoutes.post("/encrypt-deterministic-string", validateEncryptionString, deterministicEncryption)
encryptionRoutes.post("/decrypt-deterministic-string", validateDecryptionString, decryptDeterministicString)

encryptionRoutes.post("/encrypt-nondeterministic-string", validateEncryptionString, nonDeterministicEncryption)
encryptionRoutes.post("/decrypt-nondeterministic-string", validateDecryptionString, decryptNonDeterministicString)

encryptionRoutes.post("/hash-string", validateHashString, hashString)

export default encryptionRoutes
