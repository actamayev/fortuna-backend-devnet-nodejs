import express from "express"

import transferSol from "../../controllers/solana/devnet/transfer-sol"
import getTransactionFees from "../../controllers/solana/devnet/get-transaction-fees"
import createAndMintSPL from "../../controllers/solana/devnet/spl/create-and-mint-spl"
import createDevnetSolanaWallet from "../../controllers/solana/devnet/create-devnet-solana-wallet"
import requestDevnetSolanaAirdrop from "../../controllers/solana/devnet/request-devnet-solana-airdrop"
import getDevnetSolanaWalletBalance from "../../controllers/solana/devnet/get-devnet-solana-wallet-balance"

import confirmPublicKeyExists from "../../middleware/solana/confirm-public-key-exists"
import confirmNotSendingSolToSelf from "../../middleware/solana/confirm-not-sending-sol-to-self"
import validateTransferSol from "../../middleware/request-validation/solana/validate-transfer-sol"
import validateTransactionSignatures from "../../middleware/request-validation/solana/validate-transaction-signatures"
import attachDevnetSolanaWalletByUserId from "../../middleware/attach/attach-devnet-solana-wallet-by-user-id"
import validateCreateAndMintSPL from "../../middleware/request-validation/solana/validate-create-and-mint-spl"
import confirmUserHasEnoughDevnetSolToTransfer from "../../middleware/solana/confirm-user-has-enough-devnet-sol-to-transfer"
import confirmUserDoesNotHaveDevnetSolanaWallet from "../../middleware/solana/confirm-user-does-not-have-devnet-solana-wallet"
import getTransactionDetails from "../../controllers/solana/devnet/get-transaction-details"

const solanaDevnetRoutes = express.Router()

solanaDevnetRoutes.post("/create-wallet", confirmUserDoesNotHaveDevnetSolanaWallet, createDevnetSolanaWallet)

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
	"/transfer-sol",
	validateTransferSol,
	attachDevnetSolanaWalletByUserId,
	confirmNotSendingSolToSelf,
	confirmPublicKeyExists,
	confirmUserHasEnoughDevnetSolToTransfer,
	transferSol
)

export default solanaDevnetRoutes
