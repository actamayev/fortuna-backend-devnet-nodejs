import express from "express"

import createAndMintSPL from "../../controllers/solana/devnet/spl/create-and-mint-spl"
import createDevnetSolanaWallet from "../../controllers/solana/devnet/create-devnet-solana-wallet"
import requestDevnetSolanaAirdrop from "../../controllers/solana/devnet/request-devnet-solana-airdrop"
import getDevnetSolanaWalletBalance from "../../controllers/solana/devnet/get-devnet-solana-wallet-balance"

import validateCreateAndMintSPL from "../../middleware/request-validation/solana/validate-create-and-mint-spl"
import confirmUserDoesNotHaveDevnetSolanaWallet from "../../middleware/solana/confirm-user-does-not-have-devnet-solana-wallet"

const solanaDevnetRoutes = express.Router()

solanaDevnetRoutes.post("/create-wallet", confirmUserDoesNotHaveDevnetSolanaWallet, createDevnetSolanaWallet)

solanaDevnetRoutes.get("/get-wallet-balance", getDevnetSolanaWalletBalance)

solanaDevnetRoutes.post("/request-airdrop", requestDevnetSolanaAirdrop)

solanaDevnetRoutes.post(
	"/create-and-mint-spl",
	validateCreateAndMintSPL,
	createAndMintSPL
)

export default solanaDevnetRoutes
