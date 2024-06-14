import express from "express"

import getTransactions from "../controllers/positions-and-transactions/get-transactions"
import getMyPurchasedExclusiveContent from "../controllers/positions-and-transactions/get-my-purchased-exclusive-content"

import jwtVerifyAttachUser from "../middleware/jwt/jwt-verify-attach-user"
import jwtVerifyAttachSolanaWallet from "../middleware/jwt/jwt-verify-attach-solana-wallet"

const positionsAndTransactionsRoutes = express.Router()

positionsAndTransactionsRoutes.get("/get-transactions", jwtVerifyAttachSolanaWallet, getTransactions)

positionsAndTransactionsRoutes.get("/get-my-purchased-exclusive-content", jwtVerifyAttachUser, getMyPurchasedExclusiveContent)

export default positionsAndTransactionsRoutes
