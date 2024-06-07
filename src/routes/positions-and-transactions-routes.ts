import express from "express"

import getMyOwnership from "../controllers/solana/get-my-ownership"
import getTransactions from "../controllers/solana/get-transactions"

import jwtVerifyAttachSolanaWallet from "../middleware/jwt/jwt-verify-attach-solana-wallet"

const positionsAndTransactionsRoutes = express.Router()

positionsAndTransactionsRoutes.get("/get-transactions", jwtVerifyAttachSolanaWallet, getTransactions)

positionsAndTransactionsRoutes.get("/get-my-purchased-exclusive-content", jwtVerifyAttachSolanaWallet, getMyOwnership)

export default positionsAndTransactionsRoutes
