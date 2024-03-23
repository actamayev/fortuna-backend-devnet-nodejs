import express from "express"

import transferSol from "../../controllers/solana/devnet/transfer-sol"
import getTransactionFee from "../../controllers/solana/devnet/get-transaction-fee"
import createAndMintSPL from "../../controllers/solana/devnet/spl/create-and-mint-spl"
import createDevnetSolanaWallet from "../../controllers/solana/devnet/create-devnet-solana-wallet"
import requestDevnetSolanaAirdrop from "../../controllers/solana/devnet/request-devnet-solana-airdrop"
import getDevnetSolanaWalletBalance from "../../controllers/solana/devnet/get-devnet-solana-wallet-balance"

import validateTransferSol from "../../middleware/request-validation/solana/validate-transfer-sol"
import validateTransactionFee from "../../middleware/request-validation/solana/validate-transaction-fee"
import attachDevnetSolanaWalletByUserId from "../../middleware/attach/attach-devnet-solana-wallet-by-user-id"
import validateCreateAndMintSPL from "../../middleware/request-validation/solana/validate-create-and-mint-spl"
import confirmUserDoesNotHaveDevnetSolanaWallet from "../../middleware/solana/confirm-user-does-not-have-devnet-solana-wallet"
import confirmPublicKeyExists from "../../middleware/solana/confirm-public-key-exists"
import confirmNotSendingSolToSelf from "../../middleware/solana/confirm-not-sending-sol-to-self"

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

// Mainly for testing (not meant to be used by client - but can be)
solanaDevnetRoutes.post("/get-transaction-fee", validateTransactionFee, getTransactionFee)

// Mainly for testing (not meant to be used by client - but can be)
solanaDevnetRoutes.post(
	"/transfer-sol",
	validateTransferSol,
	attachDevnetSolanaWalletByUserId,
	confirmNotSendingSolToSelf,
	confirmPublicKeyExists,
	// TODO: Confirm that the user has enough to send
	transferSol
)

export default solanaDevnetRoutes
