import express from "express"

import transferSol from "../controllers/solana/transfer-sol"
import getSolPrice from "../controllers/solana/get-sol-price"
import getTransactionFees from "../controllers/solana/get-transaction-fees"
import requestSolanaAirdrop from "../controllers/solana/request-solana-airdrop"
import getTransactionDetails from "../controllers/solana/get-transaction-details"
import getSolanaWalletBalance from "../controllers/solana/get-solana-wallet-balance"

import jwtVerifyAttachUser from "../middleware/jwt/jwt-verify-attach-user"
import jwtVerifyAttachSolanaWallet from "../middleware/jwt/jwt-verify-attach-solana-wallet"
import attachSolanaWalletByUserId from "../middleware/attach/attach-solana-wallet-by-user-id"
import confirmPublicKeyExists from "../middleware/confirmations/solana/confirm-public-key-exists"
import confirmNotSendingSolToSelf from "../middleware/confirmations/solana/confirm-not-sending-sol-to-self"
import attachPublicKeyByTransferToUsername from "../middleware/attach/attach-public-key-by-transfer-to-username"
import validateTransactionSignatures from "../middleware/request-validation/solana/validate-transaction-signatures"
import validateTransferSolToUsername from "../middleware/request-validation/solana/validate-transfer-sol-to-username"
import checkIfPublicKeyPartOfFortuna from "../middleware/request-validation/solana/check-if-public-key-part-of-fortuna"
import validateTransferSolToPublicKey from "../middleware/request-validation/solana/validate-transfer-sol-to-public-key"
import confirmUserHasEnoughSolToTransfer from "../middleware/confirmations/solana/confirm-user-has-enough-sol-to-transfer"

const solanaRoutes = express.Router()

solanaRoutes.post(
	"/transfer-sol-to-username",
	validateTransferSolToUsername,
	jwtVerifyAttachUser,
	attachPublicKeyByTransferToUsername,
	confirmPublicKeyExists,
	attachSolanaWalletByUserId,
	confirmNotSendingSolToSelf,
	confirmUserHasEnoughSolToTransfer,
	transferSol
)

solanaRoutes.post(
	"/transfer-sol-to-public-key",
	validateTransferSolToPublicKey,
	confirmPublicKeyExists,
	jwtVerifyAttachUser,
	checkIfPublicKeyPartOfFortuna,
	attachSolanaWalletByUserId,
	confirmNotSendingSolToSelf,
	confirmUserHasEnoughSolToTransfer,
	transferSol
)

solanaRoutes.get("/get-sol-price", getSolPrice)

// Internal use
solanaRoutes.post("/get-transaction-fees", validateTransactionSignatures, getTransactionFees)

solanaRoutes.post("/get-transaction-details", validateTransactionSignatures, getTransactionDetails)

solanaRoutes.get(
	"/get-wallet-balance",
	jwtVerifyAttachSolanaWallet,
	getSolanaWalletBalance
)

solanaRoutes.post(
	"/request-airdrop",
	jwtVerifyAttachSolanaWallet,
	requestSolanaAirdrop
)

export default solanaRoutes
