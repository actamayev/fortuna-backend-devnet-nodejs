/*
  Warnings:

  - You are about to drop the `Credentials` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LoginHistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `NFT` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `NFTOwnership` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `NFTTransfer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SPL` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SPLOwnership` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SPLTransfer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SolanaWallet` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TokenAccount` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "network_type" AS ENUM ('MAINNET', 'DEVNET', 'TESTNET');

-- DropForeignKey
ALTER TABLE "LoginHistory" DROP CONSTRAINT "LoginHistory_user_id_fkey";

-- DropForeignKey
ALTER TABLE "NFT" DROP CONSTRAINT "NFT_solana_wallet_id_fkey";

-- DropForeignKey
ALTER TABLE "NFTOwnership" DROP CONSTRAINT "NFTOwnership_nft_id_fkey";

-- DropForeignKey
ALTER TABLE "NFTOwnership" DROP CONSTRAINT "NFTOwnership_solana_wallet_id_fkey";

-- DropForeignKey
ALTER TABLE "NFTTransfer" DROP CONSTRAINT "NFTTransfer_from_solana_wallet_id_fkey";

-- DropForeignKey
ALTER TABLE "NFTTransfer" DROP CONSTRAINT "NFTTransfer_nft_id_fkey";

-- DropForeignKey
ALTER TABLE "NFTTransfer" DROP CONSTRAINT "NFTTransfer_to_solana_wallet_id_fkey";

-- DropForeignKey
ALTER TABLE "SPL" DROP CONSTRAINT "SPL_nft_id_fkey";

-- DropForeignKey
ALTER TABLE "SPLOwnership" DROP CONSTRAINT "SPLOwnership_spl_id_fkey";

-- DropForeignKey
ALTER TABLE "SPLOwnership" DROP CONSTRAINT "SPLOwnership_token_account_id_fkey";

-- DropForeignKey
ALTER TABLE "SPLTransfer" DROP CONSTRAINT "SPLTransfer_from_token_account_id_fkey";

-- DropForeignKey
ALTER TABLE "SPLTransfer" DROP CONSTRAINT "SPLTransfer_spl_id_fkey";

-- DropForeignKey
ALTER TABLE "SPLTransfer" DROP CONSTRAINT "SPLTransfer_to_token_account_id_fkey";

-- DropForeignKey
ALTER TABLE "SolanaWallet" DROP CONSTRAINT "SolanaWallet_user_id_fkey";

-- DropForeignKey
ALTER TABLE "TokenAccount" DROP CONSTRAINT "TokenAccount_solana_wallet_id_fkey";

-- DropForeignKey
ALTER TABLE "TokenAccount" DROP CONSTRAINT "TokenAccount_spl_id_fkey";

-- DropTable
DROP TABLE "Credentials";

-- DropTable
DROP TABLE "LoginHistory";

-- DropTable
DROP TABLE "NFT";

-- DropTable
DROP TABLE "NFTOwnership";

-- DropTable
DROP TABLE "NFTTransfer";

-- DropTable
DROP TABLE "SPL";

-- DropTable
DROP TABLE "SPLOwnership";

-- DropTable
DROP TABLE "SPLTransfer";

-- DropTable
DROP TABLE "SolanaWallet";

-- DropTable
DROP TABLE "TokenAccount";

-- DropEnum
DROP TYPE "NetworkType";

-- CreateTable
CREATE TABLE "credentials" (
    "user_id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "email" TEXT,
    "phone_number" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "credentials_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "login_history" (
    "login_history_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "login_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "login_history_pkey" PRIMARY KEY ("login_history_id")
);

-- CreateTable
CREATE TABLE "solana_wallet" (
    "solana_wallet_id" SERIAL NOT NULL,
    "public_key" VARCHAR(255) NOT NULL,
    "secret_key" VARCHAR(255) NOT NULL,
    "user_id" INTEGER NOT NULL,
    "network_type" "network_type" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "solana_wallet_pkey" PRIMARY KEY ("solana_wallet_id")
);

-- CreateTable
CREATE TABLE "token_account" (
    "token_account_id" SERIAL NOT NULL,
    "spl_id" INTEGER NOT NULL,
    "solana_wallet_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "token_account_pkey" PRIMARY KEY ("token_account_id")
);

-- CreateTable
CREATE TABLE "nft" (
    "nft_id" SERIAL NOT NULL,
    "solana_wallet_id" INTEGER NOT NULL,
    "meta_data_url" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "nft_name" TEXT NOT NULL,
    "chain_address" TEXT NOT NULL,
    "meta_data_address" TEXT NOT NULL,
    "listing_price" INTEGER NOT NULL,
    "blockchain_mint_fee" INTEGER NOT NULL,
    "payer_solana_wallet_id" INTEGER NOT NULL,
    "description" TEXT,
    "nft_listing_status" "NFTListingStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "nft_pkey" PRIMARY KEY ("nft_id")
);

-- CreateTable
CREATE TABLE "nft_ownership" (
    "nft_ownership_id" SERIAL NOT NULL,
    "nft_id" INTEGER NOT NULL,
    "solana_wallet_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "nft_ownership_pkey" PRIMARY KEY ("nft_ownership_id")
);

-- CreateTable
CREATE TABLE "nft_transfer" (
    "nft_transfer_id" SERIAL NOT NULL,
    "nft_id" INTEGER NOT NULL,
    "to_solana_wallet_id" INTEGER NOT NULL,
    "from_solana_wallet_id" INTEGER NOT NULL,
    "blockchain_transfer_fee" INTEGER NOT NULL,
    "payer_solana_wallet_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "nft_transfer_pkey" PRIMARY KEY ("nft_transfer_id")
);

-- CreateTable
CREATE TABLE "spl" (
    "spl_id" SERIAL NOT NULL,
    "nft_id" INTEGER NOT NULL,
    "public_key_address" TEXT NOT NULL,
    "blockchain_mint_fee" INTEGER NOT NULL,
    "payer_solana_wallet_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "spl_pkey" PRIMARY KEY ("spl_id")
);

-- CreateTable
CREATE TABLE "spl_ownership" (
    "spl_ownership_id" SERIAL NOT NULL,
    "spl_id" INTEGER NOT NULL,
    "token_account_id" INTEGER NOT NULL,
    "number_of_shares" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "spl_ownership_pkey" PRIMARY KEY ("spl_ownership_id")
);

-- CreateTable
CREATE TABLE "spl_transfer" (
    "spl_transfer_id" SERIAL NOT NULL,
    "spl_id" INTEGER NOT NULL,
    "recipient_token_account_id" INTEGER NOT NULL,
    "sender_token_account_id" INTEGER NOT NULL,
    "number_of_shares" INTEGER NOT NULL,
    "blockchain_mint_fee" INTEGER NOT NULL,
    "payer_solana_wallet_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "spl_transfer_pkey" PRIMARY KEY ("spl_transfer_id")
);

-- CreateTable
CREATE TABLE "spl_mint" (
    "splt_mint_id" SERIAL NOT NULL,
    "spl_id" INTEGER NOT NULL,
    "token_account_id" INTEGER NOT NULL,
    "number_of_shares" INTEGER NOT NULL,
    "blockchain_mint_fee" INTEGER NOT NULL,
    "payer_solana_wallet_id" INTEGER NOT NULL,
    "transaction_signature" TEXT NOT NULL,

    CONSTRAINT "spl_mint_pkey" PRIMARY KEY ("splt_mint_id")
);

-- CreateIndex
CREATE INDEX "login_history__user_id_idx" ON "login_history"("user_id");

-- CreateIndex
CREATE INDEX "solana_wallet__user_id_idx" ON "solana_wallet"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "solana_wallet_user_id_network_type_key" ON "solana_wallet"("user_id", "network_type");

-- CreateIndex
CREATE INDEX "token_account__spl_id_idx" ON "token_account"("spl_id");

-- CreateIndex
CREATE INDEX "token_account__solana_wallet_id_idx" ON "token_account"("solana_wallet_id");

-- CreateIndex
CREATE UNIQUE INDEX "token_account_spl_id_solana_wallet_id_key" ON "token_account"("spl_id", "solana_wallet_id");

-- CreateIndex
CREATE INDEX "nft__solana_wallet_id_idx" ON "nft"("solana_wallet_id");

-- CreateIndex
CREATE INDEX "nft_payer_solana_wallet_id_idx" ON "nft"("payer_solana_wallet_id");

-- CreateIndex
CREATE INDEX "nft_ownership__nft_id_idx" ON "nft_ownership"("nft_id");

-- CreateIndex
CREATE INDEX "nft_ownership__solana_wallet_id_idx" ON "nft_ownership"("solana_wallet_id");

-- CreateIndex
CREATE UNIQUE INDEX "nft_ownership_nft_id_solana_wallet_id_key" ON "nft_ownership"("nft_id", "solana_wallet_id");

-- CreateIndex
CREATE INDEX "nft_transfer__nft_id_idx" ON "nft_transfer"("nft_id");

-- CreateIndex
CREATE INDEX "nft_transfer__to_solana_wallet_id_idx" ON "nft_transfer"("to_solana_wallet_id");

-- CreateIndex
CREATE INDEX "nft_transfer__from_solana_wallet_id_idx" ON "nft_transfer"("from_solana_wallet_id");

-- CreateIndex
CREATE INDEX "nft_transfer__payer_solana_wallet_id_idx" ON "nft_transfer"("payer_solana_wallet_id");

-- CreateIndex
CREATE INDEX "spl__nft_id_idx" ON "spl"("nft_id");

-- CreateIndex
CREATE INDEX "spl__payer_solana_wallet_id_idx" ON "spl"("payer_solana_wallet_id");

-- CreateIndex
CREATE INDEX "spl_ownership__spl_id_idx" ON "spl_ownership"("spl_id");

-- CreateIndex
CREATE INDEX "spl_ownership__token_account_id_idx" ON "spl_ownership"("token_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "spl_ownership_spl_id_token_account_id_key" ON "spl_ownership"("spl_id", "token_account_id");

-- CreateIndex
CREATE INDEX "spl_transfer__spl_id_idx" ON "spl_transfer"("spl_id");

-- CreateIndex
CREATE INDEX "spl_transfer__recipient_token_account_id_idx" ON "spl_transfer"("recipient_token_account_id");

-- CreateIndex
CREATE INDEX "spl_transfer__sender_token_account_id_idx" ON "spl_transfer"("sender_token_account_id");

-- CreateIndex
CREATE INDEX "spl_transfer__payer_solana_wallet_id_idx" ON "spl_transfer"("payer_solana_wallet_id");

-- CreateIndex
CREATE INDEX "spl_mint__spl_id_idx" ON "spl_mint"("spl_id");

-- CreateIndex
CREATE INDEX "spl_mint__token_account_id_idx" ON "spl_mint"("token_account_id");

-- CreateIndex
CREATE INDEX "spl_mint__payer_solana_wallet_id_idx" ON "spl_mint"("payer_solana_wallet_id");

-- AddForeignKey
ALTER TABLE "login_history" ADD CONSTRAINT "login_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "credentials"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solana_wallet" ADD CONSTRAINT "solana_wallet_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "credentials"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "token_account" ADD CONSTRAINT "token_account_spl_id_fkey" FOREIGN KEY ("spl_id") REFERENCES "spl"("spl_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "token_account" ADD CONSTRAINT "token_account_solana_wallet_id_fkey" FOREIGN KEY ("solana_wallet_id") REFERENCES "solana_wallet"("solana_wallet_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nft" ADD CONSTRAINT "nft_solana_wallet_id_fkey" FOREIGN KEY ("solana_wallet_id") REFERENCES "solana_wallet"("solana_wallet_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nft" ADD CONSTRAINT "nft_payer_solana_wallet_id_fkey" FOREIGN KEY ("payer_solana_wallet_id") REFERENCES "solana_wallet"("solana_wallet_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nft_ownership" ADD CONSTRAINT "nft_ownership_nft_id_fkey" FOREIGN KEY ("nft_id") REFERENCES "nft"("nft_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nft_ownership" ADD CONSTRAINT "nft_ownership_solana_wallet_id_fkey" FOREIGN KEY ("solana_wallet_id") REFERENCES "solana_wallet"("solana_wallet_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nft_transfer" ADD CONSTRAINT "nft_transfer_nft_id_fkey" FOREIGN KEY ("nft_id") REFERENCES "nft"("nft_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nft_transfer" ADD CONSTRAINT "nft_transfer_to_solana_wallet_id_fkey" FOREIGN KEY ("to_solana_wallet_id") REFERENCES "solana_wallet"("solana_wallet_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nft_transfer" ADD CONSTRAINT "nft_transfer_from_solana_wallet_id_fkey" FOREIGN KEY ("from_solana_wallet_id") REFERENCES "solana_wallet"("solana_wallet_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nft_transfer" ADD CONSTRAINT "nft_transfer_payer_solana_wallet_id_fkey" FOREIGN KEY ("payer_solana_wallet_id") REFERENCES "solana_wallet"("solana_wallet_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spl" ADD CONSTRAINT "spl_nft_id_fkey" FOREIGN KEY ("nft_id") REFERENCES "nft"("nft_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spl" ADD CONSTRAINT "spl_payer_solana_wallet_id_fkey" FOREIGN KEY ("payer_solana_wallet_id") REFERENCES "solana_wallet"("solana_wallet_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spl_ownership" ADD CONSTRAINT "spl_ownership_spl_id_fkey" FOREIGN KEY ("spl_id") REFERENCES "spl"("spl_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spl_ownership" ADD CONSTRAINT "spl_ownership_token_account_id_fkey" FOREIGN KEY ("token_account_id") REFERENCES "token_account"("token_account_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spl_transfer" ADD CONSTRAINT "spl_transfer_spl_id_fkey" FOREIGN KEY ("spl_id") REFERENCES "spl"("spl_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spl_transfer" ADD CONSTRAINT "spl_transfer_recipient_token_account_id_fkey" FOREIGN KEY ("recipient_token_account_id") REFERENCES "token_account"("token_account_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spl_transfer" ADD CONSTRAINT "spl_transfer_sender_token_account_id_fkey" FOREIGN KEY ("sender_token_account_id") REFERENCES "token_account"("token_account_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spl_transfer" ADD CONSTRAINT "spl_transfer_payer_solana_wallet_id_fkey" FOREIGN KEY ("payer_solana_wallet_id") REFERENCES "solana_wallet"("solana_wallet_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spl_mint" ADD CONSTRAINT "spl_mint_spl_id_fkey" FOREIGN KEY ("spl_id") REFERENCES "spl"("spl_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spl_mint" ADD CONSTRAINT "spl_mint_token_account_id_fkey" FOREIGN KEY ("token_account_id") REFERENCES "token_account"("token_account_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spl_mint" ADD CONSTRAINT "spl_mint_payer_solana_wallet_id_fkey" FOREIGN KEY ("payer_solana_wallet_id") REFERENCES "solana_wallet"("solana_wallet_id") ON DELETE RESTRICT ON UPDATE CASCADE;
