import express from "express"

import jwtVerify from "../middleware/jwt/jwt-verify"

import createSolanaWallet from "../controllers/solana/create-solana-wallet"

const solanaRoutes = express.Router()

solanaRoutes.post("/create-wallet", jwtVerify, createSolanaWallet)

export default solanaRoutes
