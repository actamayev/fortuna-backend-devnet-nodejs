import express from "express"

import getMyOwnership from "../controllers/solana/get-my-ownership"
import getTransactions from "../controllers/solana/get-transactions"
import getCreatorContentList from "../controllers/solana/get-creator-content-list"

import confirmUserIsCreator from "../middleware/confirmations/confirm-user-is-creator"
import attachSolanaWalletByUserId from "../middleware/attach/attach-solana-wallet-by-user-id"

const positionsAndTransactionsRoutes = express.Router()

positionsAndTransactionsRoutes.get("/get-transactions", attachSolanaWalletByUserId, getTransactions)

positionsAndTransactionsRoutes.get(
	"/get-creator-content-list",
	confirmUserIsCreator,
	attachSolanaWalletByUserId,
	getCreatorContentList
)

positionsAndTransactionsRoutes.get("/get-my-ownership", attachSolanaWalletByUserId, getMyOwnership)

export default positionsAndTransactionsRoutes
