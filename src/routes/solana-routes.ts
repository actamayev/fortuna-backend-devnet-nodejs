import express from "express"

import transferSol from "../controllers/solana/transfer-sol"
import getSolPrice from "../controllers/solana/get-sol-price"
import createAndMintSPL from "../controllers/solana/create-and-mint-spl"
import getTransactionFees from "../controllers/solana/get-transaction-fees"
import requestSolanaAirdrop from "../controllers/solana/request-solana-airdrop"
import getTransactionDetails from "../controllers/solana/get-transaction-details"
import getSolanaWalletBalance from "../controllers/solana/get-solana-wallet-balance"
import getNumberOfTokensInTokenAccount from "../controllers/solana/get-number-of-tokens-in-token-account"

import jwtVerify from "../middleware/jwt/jwt-verify"
import confirmUserIsCreator from "../middleware/confirmations/confirm-user-is-creator"
import attachSolanaWalletByUserId from "../middleware/attach/attach-solana-wallet-by-user-id"
import confirmPublicKeyExists from "../middleware/confirmations/solana/confirm-public-key-exists"
import validateCreateAndMintSPL from "../middleware/request-validation/solana/validate-create-and-mint-spl"
import confirmNotSendingSolToSelf from "../middleware/confirmations/solana/confirm-not-sending-sol-to-self"
import validateTransactionSignatures from "../middleware/request-validation/solana/validate-transaction-signatures"
import validateTransferSolToUsername from "../middleware/request-validation/solana/validate-transfer-sol-to-username"
import checkIfPublicKeyPartOfFortuna from "../middleware/request-validation/solana/check-if-public-key-part-of-fortuna"
import validateTransferSolToPublicKey from "../middleware/request-validation/solana/validate-transfer-sol-to-public-key"
import confirmUserHasEnoughSolToTransfer from "../middleware/confirmations/solana/confirm-user-has-enough-sol-to-transfer"

const solanaRoutes = express.Router()

solanaRoutes.get(
	"/get-wallet-balance",
	jwtVerify,
	attachSolanaWalletByUserId,
	getSolanaWalletBalance
)

solanaRoutes.post(
	"/request-airdrop",
	jwtVerify,
	attachSolanaWalletByUserId,
	requestSolanaAirdrop
)

solanaRoutes.post(
	"/create-and-mint-spl",
	jwtVerify,
	confirmUserIsCreator,
	validateCreateAndMintSPL,
	attachSolanaWalletByUserId,
	createAndMintSPL
)

solanaRoutes.post(
	"/transfer-sol-to-username",
	jwtVerify,
	validateTransferSolToUsername,
	confirmPublicKeyExists,
	attachSolanaWalletByUserId,
	confirmNotSendingSolToSelf,
	confirmUserHasEnoughSolToTransfer,
	transferSol
)

solanaRoutes.post(
	"/transfer-sol-to-public-key",
	jwtVerify,
	validateTransferSolToPublicKey,
	checkIfPublicKeyPartOfFortuna,
	confirmPublicKeyExists,
	attachSolanaWalletByUserId,
	confirmNotSendingSolToSelf,
	confirmUserHasEnoughSolToTransfer,
	transferSol
)

solanaRoutes.get("/get-sol-price", getSolPrice)

// Internal use
solanaRoutes.get("/get-token-counts-in-wallet/:publicKey", jwtVerify, getNumberOfTokensInTokenAccount)
solanaRoutes.post(
	"/get-transaction-fees",
	jwtVerify,
	validateTransactionSignatures,
	getTransactionFees
)

solanaRoutes.post(
	"/get-transaction-details",
	jwtVerify,
	validateTransactionSignatures,
	getTransactionDetails
)

export default solanaRoutes
