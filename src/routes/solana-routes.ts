import express from "express"

import transferSol from "../controllers/solana/transfer-sol"
import getSolPrice from "../controllers/solana/get-sol-price"
import getMyOwnership from "../controllers/solana/get-my-ownership"
import getTransactions from "../controllers/solana/get-transactions"
import createAndMintSPL from "../controllers/solana/create-and-mint-spl"
import getTransactionFees from "../controllers/solana/get-transaction-fees"
import purchaseSplTokens from "../controllers/solana/purchase-spl-tokens"
import requestSolanaAirdrop from "../controllers/solana/request-solana-airdrop"
import getTransactionDetails from "../controllers/solana/get-transaction-details"
import getCreatorContentList from "../controllers/solana/get-creator-content-list"
import getSolanaWalletBalance from "../controllers/solana/get-solana-wallet-balance"
import getNumberOfTokensInTokenAccount from "../controllers/solana/get-number-of-tokens-in-token-account"

import jwtVerify from "../middleware/jwt/jwt-verify"
import confirmUserIsCreator from "../middleware/confirm-user-is-creator"
import confirmPublicKeyExists from "../middleware/solana/confirm-public-key-exists"
import confirmNotSendingSolToSelf from "../middleware/solana/confirm-not-sending-sol-to-self"
import attachSolanaWalletByUserId from "../middleware/attach/attach-solana-wallet-by-user-id"
import attachSplDetailsByPublicKey from "../middleware/attach/attach-spl-details-by-public-key"
import confirmCreatorNotBuyingOwnShares from "../middleware/solana/confirm-creator-not-buying-own-shares"
import validateCreateAndMintSPL from "../middleware/request-validation/solana/validate-create-and-mint-spl"
import confirmUserHasEnoughSolToTransfer from "../middleware/solana/confirm-user-has-enough-sol-to-transfer"
import validatePurchaseSplTokens from "../middleware/request-validation/solana/validate-purchase-spl-tokens"
import validateTransactionSignatures from "../middleware/request-validation/solana/validate-transaction-signatures"
import validateTransferSolToUsername from "../middleware/request-validation/solana/validate-transfer-sol-to-username"
import checkIfPublicKeyPartOfFortuna from "../middleware/request-validation/solana/check-if-public-key-part-of-fortuna"
import validateTransferSolToPublicKey from "../middleware/request-validation/solana/validate-transfer-sol-to-public-key"
import confirmUserHasEnoughSolToPurchaseTokens from "../middleware/solana/confirm-user-has-enough-sol-to-purchase-tokens"
import confirmEnoughSharesInEscrowToCompletePurchase from "../middleware/solana/confirm-enough-shares-in-escrow-to-complete-purchase"

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

solanaRoutes.post(
	"/purchase-spl-tokens",
	jwtVerify,
	validatePurchaseSplTokens,
	attachSplDetailsByPublicKey,
	confirmEnoughSharesInEscrowToCompletePurchase,
	attachSolanaWalletByUserId,
	confirmCreatorNotBuyingOwnShares,
	confirmUserHasEnoughSolToPurchaseTokens,
	purchaseSplTokens
)

// FUTURE TODO: Add an endpoint that allows for a creator to buy their own shares.
// The creator will pay the Fortuna Wallet for the shares they're buying

solanaRoutes.get(
	"/get-transactions",
	jwtVerify,
	attachSolanaWalletByUserId,
	getTransactions
)

solanaRoutes.get(
	"/get-creator-content-list",
	jwtVerify,
	confirmUserIsCreator,
	attachSolanaWalletByUserId,
	getCreatorContentList
)

solanaRoutes.get(
	"/get-my-ownership",
	jwtVerify,
	attachSolanaWalletByUserId,
	getMyOwnership
)

solanaRoutes.get("/get-sol-price", getSolPrice)

// Internal use
solanaRoutes.get("/get-number-tokens-in-token-account/:publicKey", jwtVerify, getNumberOfTokensInTokenAccount)

export default solanaRoutes
