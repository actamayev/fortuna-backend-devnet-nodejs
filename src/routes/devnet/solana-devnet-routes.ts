import express from "express"

import transferSol from "../../controllers/solana/devnet/transfer-sol"
import getTransactions from "../../controllers/solana/devnet/get-transactions"
import createAndMintSPL from "../../controllers/solana/devnet/create-and-mint-spl"
import getTransactionFees from "../../controllers/solana/devnet/get-transaction-fees"
import getTransactionDetails from "../../controllers/solana/devnet/get-transaction-details"
import getCreatorContentList from "../../controllers/solana/devnet/get-creator-content-list"
import requestDevnetSolanaAirdrop from "../../controllers/solana/devnet/request-devnet-solana-airdrop"
import getDevnetSolanaWalletBalance from "../../controllers/solana/devnet/get-devnet-solana-wallet-balance"

import confirmPublicKeyExists from "../../middleware/solana/confirm-public-key-exists"
import confirmNotSendingSolToSelf from "../../middleware/solana/confirm-not-sending-sol-to-self"
import attachDevnetSolanaWalletByUserId from "../../middleware/attach/attach-devnet-solana-wallet-by-user-id"
import validateCreateAndMintSPL from "../../middleware/request-validation/solana/validate-create-and-mint-spl"
import validateTransactionSignatures from "../../middleware/request-validation/solana/validate-transaction-signatures"
import validateTransferSolToUsername from "../../middleware/request-validation/solana/validate-transfer-sol-to-username"
import checkIfPublicKeyPartOfFortuna from "../../middleware/request-validation/solana/check-if-public-key-part-of-fortuna"
import validateTransferSolToPublicKey from "../../middleware/request-validation/solana/validate-transfer-sol-to-public-key"
import confirmUserHasEnoughDevnetSolToTransfer from "../../middleware/solana/confirm-user-has-enough-devnet-sol-to-transfer"

const solanaDevnetRoutes = express.Router()

solanaDevnetRoutes.get("/get-wallet-balance", attachDevnetSolanaWalletByUserId, getDevnetSolanaWalletBalance)

solanaDevnetRoutes.post("/request-airdrop", attachDevnetSolanaWalletByUserId, requestDevnetSolanaAirdrop)

solanaDevnetRoutes.post(
	"/create-and-mint-spl",
	validateCreateAndMintSPL,
	attachDevnetSolanaWalletByUserId,
	createAndMintSPL
)

solanaDevnetRoutes.post("/get-transaction-fees", validateTransactionSignatures, getTransactionFees)

solanaDevnetRoutes.post("/get-transaction-details", validateTransactionSignatures, getTransactionDetails)

solanaDevnetRoutes.post(
	"/transfer-sol-to-username",
	validateTransferSolToUsername,
	confirmPublicKeyExists,
	attachDevnetSolanaWalletByUserId,
	confirmNotSendingSolToSelf,
	confirmUserHasEnoughDevnetSolToTransfer,
	transferSol
)

solanaDevnetRoutes.post(
	"/transfer-sol-to-public-key",
	validateTransferSolToPublicKey,
	checkIfPublicKeyPartOfFortuna,
	confirmPublicKeyExists,
	attachDevnetSolanaWalletByUserId,
	confirmNotSendingSolToSelf,
	confirmUserHasEnoughDevnetSolToTransfer,
	transferSol
)

solanaDevnetRoutes.get("/get-transactions", attachDevnetSolanaWalletByUserId, getTransactions)
solanaDevnetRoutes.get("/get-creator-content-list", attachDevnetSolanaWalletByUserId, getCreatorContentList)

export default solanaDevnetRoutes
