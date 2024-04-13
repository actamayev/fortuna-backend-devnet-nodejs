import express from "express"

import transferSol from "../controllers/solana/transfer-sol"
import getTransactions from "../controllers/solana/get-transactions"
import createAndMintSPL from "../controllers/solana/create-and-mint-spl"
import getTransactionFees from "../controllers/solana/get-transaction-fees"
import requestSolanaAirdrop from "../controllers/solana/request-solana-airdrop"
import getTransactionDetails from "../controllers/solana/get-transaction-details"
import getCreatorContentList from "../controllers/solana/get-creator-content-list"
import getSolanaWalletBalance from "../controllers/solana/get-solana-wallet-balance"

import confirmPublicKeyExists from "../middleware/solana/confirm-public-key-exists"
import confirmNotSendingSolToSelf from "../middleware/solana/confirm-not-sending-sol-to-self"
import attachSolanaWalletByUserId from "../middleware/attach/attach-solana-wallet-by-user-id"
import validateCreateAndMintSPL from "../middleware/request-validation/solana/validate-create-and-mint-spl"
import confirmUserHasEnoughSolToTransfer from "../middleware/solana/confirm-user-has-enough-sol-to-transfer"
import validateTransactionSignatures from "../middleware/request-validation/solana/validate-transaction-signatures"
import validateTransferSolToUsername from "../middleware/request-validation/solana/validate-transfer-sol-to-username"
import checkIfPublicKeyPartOfFortuna from "../middleware/request-validation/solana/check-if-public-key-part-of-fortuna"
import validateTransferSolToPublicKey from "../middleware/request-validation/solana/validate-transfer-sol-to-public-key"

const solanaRoutes = express.Router()

solanaRoutes.get("/get-wallet-balance", attachSolanaWalletByUserId, getSolanaWalletBalance)

solanaRoutes.post("/request-airdrop", attachSolanaWalletByUserId, requestSolanaAirdrop)

solanaRoutes.post(
	"/create-and-mint-spl",
	validateCreateAndMintSPL,
	attachSolanaWalletByUserId,
	createAndMintSPL
)

solanaRoutes.post("/get-transaction-fees", validateTransactionSignatures, getTransactionFees)

solanaRoutes.post("/get-transaction-details", validateTransactionSignatures, getTransactionDetails)

solanaRoutes.post(
	"/transfer-sol-to-username",
	validateTransferSolToUsername,
	confirmPublicKeyExists,
	attachSolanaWalletByUserId,
	confirmNotSendingSolToSelf,
	confirmUserHasEnoughSolToTransfer,
	transferSol
)

solanaRoutes.post(
	"/transfer-sol-to-public-key",
	validateTransferSolToPublicKey,
	checkIfPublicKeyPartOfFortuna,
	confirmPublicKeyExists,
	attachSolanaWalletByUserId,
	confirmNotSendingSolToSelf,
	confirmUserHasEnoughSolToTransfer,
	transferSol
)

solanaRoutes.get("/get-transactions", attachSolanaWalletByUserId, getTransactions)
solanaRoutes.get("/get-creator-content-list", attachSolanaWalletByUserId, getCreatorContentList)

export default solanaRoutes
