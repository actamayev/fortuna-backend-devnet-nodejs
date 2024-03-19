import multer from "multer"
import express from "express"

import uploadFileAndMintNFT from "../../controllers/solana/devnet/nft/upload-file-and-mint-nft"
import createDevnetSolanaWallet from "../../controllers/solana/devnet/create-devnet-solana-wallet"
import requestDevnetSolanaAirdrop from "../../controllers/solana/devnet/request-devnet-solana-airdrop"
import getDevnetSolanaWalletBalance from "../../controllers/solana/devnet/get-devnet-solana-wallet-balance"

import confirmUserDoesNotHaveDevnetSolanaWallet from "../../middleware/solana/confirm-user-does-not-have-devnet-solana-wallet"

const solanaDevnetRoutes = express.Router()
const upload = multer()

solanaDevnetRoutes.post("/create-wallet", confirmUserDoesNotHaveDevnetSolanaWallet, createDevnetSolanaWallet)

solanaDevnetRoutes.get("/get-wallet-balance", getDevnetSolanaWalletBalance)

solanaDevnetRoutes.post("/request-airdrop", requestDevnetSolanaAirdrop)

solanaDevnetRoutes.post("/upload-file-mint-nft", upload.single("file"), uploadFileAndMintNFT)

export default solanaDevnetRoutes
