import express from "express"

import getWalletBalance from "../controllers/solana/get-wallet-balance"
import createSolanaWallet from "../controllers/solana/create-solana-wallet"

import confirmUserDoesNotHaveSolanaWallet from "../middleware/solana/confirm-user-does-not-have-solana-wallet"

const solanaRoutes = express.Router()

solanaRoutes.post(
	"/create-wallet",
	confirmUserDoesNotHaveSolanaWallet,
	createSolanaWallet
)

solanaRoutes.get("/get-wallet-balance", getWalletBalance)

export default solanaRoutes
