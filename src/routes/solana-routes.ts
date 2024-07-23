import express from "express"

import transferSol from "../controllers/solana/transfer-sol"
import getSolPrice from "../controllers/solana/get-sol-price"
import getTransactionFees from "../controllers/solana/get-transaction-fees"
import requestSolanaAirdrop from "../controllers/solana/request-solana-airdrop"
import getTransactionDetails from "../controllers/solana/get-transaction-details"
import getSolanaWalletBalance from "../controllers/solana/get-solana-wallet-balance"
import getInboundTransferHistory from "../controllers/solana/get-inbound-transfer-history"

import jwtVerifyAttachUser from "../middleware/jwt/jwt-verify-attach-user"
import validatePublicKey from "../middleware/request-validation/search/validate-public-key"
import jwtVerifyAttachSolanaWallet from "../middleware/jwt/jwt-verify-attach-solana-wallet"
import attachSolanaWalletByUserId from "../middleware/attach/attach-solana-wallet-by-user-id"
import confirmPublicKeyExists from "../middleware/confirmations/solana/confirm-public-key-exists"
import confirmNotSendingSolToSelf from "../middleware/confirmations/solana/confirm-not-sending-sol-to-self"
import attachPublicKeyByTransferToUsername from "../middleware/attach/attach-public-key-by-transfer-to-username"
import validateTransactionSignatures from "../middleware/request-validation/solana/validate-transaction-signatures"
import validateTransferSolToUsername from "../middleware/request-validation/solana/validate-transfer-sol-to-username"
import checkIfPublicKeyPartOfFortuna from "../middleware/request-validation/solana/check-if-public-key-part-of-fortuna"
import validateTransferSolToPublicKey from "../middleware/request-validation/solana/validate-transfer-sol-to-public-key"
import confirmUserHasSufficientFundsToTransfer from "../middleware/confirmations/solana/confirm-user-has-sufficient-funds-to-transfer"

const solanaRoutes = express.Router()

solanaRoutes.post(
	"/money-transfer-to-username",
	validateTransferSolToUsername,
	jwtVerifyAttachUser,
	attachPublicKeyByTransferToUsername,
	confirmPublicKeyExists,
	attachSolanaWalletByUserId,
	confirmNotSendingSolToSelf,
	confirmUserHasSufficientFundsToTransfer,
	transferSol
)

solanaRoutes.post(
	"/money-transfer-to-public-key",
	validateTransferSolToPublicKey,
	confirmPublicKeyExists,
	jwtVerifyAttachUser,
	checkIfPublicKeyPartOfFortuna,
	attachSolanaWalletByUserId,
	confirmNotSendingSolToSelf,
	confirmUserHasSufficientFundsToTransfer,
	transferSol
)

solanaRoutes.get("/get-sol-price", getSolPrice)

// Internal use
solanaRoutes.post("/get-transaction-fees", validateTransactionSignatures, getTransactionFees)

solanaRoutes.post("/get-transaction-details", validateTransactionSignatures, getTransactionDetails)

solanaRoutes.get("/get-wallet-balance", jwtVerifyAttachSolanaWallet, getSolanaWalletBalance)

solanaRoutes.post("/request-airdrop", jwtVerifyAttachSolanaWallet, requestSolanaAirdrop)

solanaRoutes.get("/get-inbound-transfer-history/:publicKey", validatePublicKey, getInboundTransferHistory)

export default solanaRoutes
