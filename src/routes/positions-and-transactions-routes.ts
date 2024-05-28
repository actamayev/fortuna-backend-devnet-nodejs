import express from "express"

import getMyOwnership from "../controllers/solana/get-my-ownership"
import getTransactions from "../controllers/solana/get-transactions"
import getCreatorContentList from "../controllers/solana/get-creator-content-list"

import jwtVerifyAttachUser from "../middleware/jwt/jwt-verify-attach-user"
import confirmUserIsCreator from "../middleware/confirmations/confirm-user-is-creator"
import jwtVerifyAttachSolanaWallet from "../middleware/jwt/jwt-verify-attach-solana-wallet"
import attachSolanaWalletByUserId from "../middleware/attach/attach-solana-wallet-by-user-id"

const positionsAndTransactionsRoutes = express.Router()

positionsAndTransactionsRoutes.get("/get-transactions", jwtVerifyAttachSolanaWallet, getTransactions)

positionsAndTransactionsRoutes.get(
	"/get-creator-content-list",
	jwtVerifyAttachUser,
	confirmUserIsCreator,
	attachSolanaWalletByUserId,
	getCreatorContentList
)

positionsAndTransactionsRoutes.get("/get-my-ownership", jwtVerifyAttachSolanaWallet, getMyOwnership)

export default positionsAndTransactionsRoutes
