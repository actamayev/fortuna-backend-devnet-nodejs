import express from "express"

import jwtVerify from "../middleware/jwt/jwt-verify"

import createSolanaWallet from "../controllers/solana/create-solana-wallet"
import confirmUserDoesNotHaveSolanaWallet from "../middleware/solana/confirm-user-does-not-have-solana-wallet"

const solanaRoutes = express.Router()

solanaRoutes.post(
	"/create-wallet",
	jwtVerify,
	confirmUserDoesNotHaveSolanaWallet,
	createSolanaWallet
)

export default solanaRoutes
