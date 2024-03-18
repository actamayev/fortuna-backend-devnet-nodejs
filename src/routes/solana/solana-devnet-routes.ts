import express from "express"

import createDevnetSolanaWallet from "../../controllers/solana/devnet/create-devnet-solana-wallet"
import requestDevnetSolanaAirdrop from "../../controllers/solana/devnet/request-devnet-solana-airdrop"
import getDevnetSolanaWalletBalance from "../../controllers/solana/devnet/get-devnet-solana-wallet-balance"

import confirmUserDoesNotHaveDevnetSolanaWallet from "../../middleware/solana/confirm-user-does-not-have-devnet-solana-wallet"

const solanaDevnetRoutes = express.Router()

solanaDevnetRoutes.post("/create-wallet", confirmUserDoesNotHaveDevnetSolanaWallet, createDevnetSolanaWallet)

solanaDevnetRoutes.get("/get-wallet-balance", getDevnetSolanaWalletBalance)

solanaDevnetRoutes.post("/request-airdrop", requestDevnetSolanaAirdrop)

export default solanaDevnetRoutes
