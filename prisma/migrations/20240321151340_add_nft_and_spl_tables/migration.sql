/*
  Warnings:

  - You are about to drop the column `user_id` on the `NFT` table. All the data in the column will be lost.
  - You are about to drop the column `number_of_shares` on the `NFTOwnership` table. All the data in the column will be lost.
  - You are about to drop the column `token_account_id` on the `NFTOwnership` table. All the data in the column will be lost.
  - You are about to drop the column `nft_id` on the `SPLTransfer` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `TokenAccount` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nft_id,solana_wallet_id]` on the table `NFTOwnership` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[spl_id,solana_wallet_id]` on the table `TokenAccount` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `listing_price` to the `NFT` table without a default value. This is not possible if the table is not empty.
  - Added the required column `solana_wallet_id` to the `NFTOwnership` table without a default value. This is not possible if the table is not empty.
  - Added the required column `spl_id` to the `SPLTransfer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `spl_id` to the `TokenAccount` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "NFT" DROP CONSTRAINT "NFT_user_id_fkey";

-- DropForeignKey
ALTER TABLE "NFTOwnership" DROP CONSTRAINT "NFTOwnership_token_account_id_fkey";

-- DropForeignKey
ALTER TABLE "SPLTransfer" DROP CONSTRAINT "SPLTransfer_nft_id_fkey";

-- DropForeignKey
ALTER TABLE "TokenAccount" DROP CONSTRAINT "TokenAccount_user_id_fkey";

-- DropIndex
DROP INDEX "nft__user_id_idx";

-- DropIndex
DROP INDEX "NFTOwnership_nft_id_token_account_id_key";

-- DropIndex
DROP INDEX "nft_ownership__token_account_id_idx";

-- DropIndex
DROP INDEX "spl_transfer__nft_id_idx";

-- DropIndex
DROP INDEX "token_account__user_id_idx";

-- AlterTable
ALTER TABLE "NFT" DROP COLUMN "user_id",
ADD COLUMN     "listing_price" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "NFTOwnership" DROP COLUMN "number_of_shares",
DROP COLUMN "token_account_id",
ADD COLUMN     "solana_wallet_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "SPLTransfer" DROP COLUMN "nft_id",
ADD COLUMN     "spl_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "TokenAccount" DROP COLUMN "user_id",
ADD COLUMN     "spl_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "NFTTransfer" (
    "nft_transfer_id" SERIAL NOT NULL,
    "nft_id" INTEGER NOT NULL,
    "to_solana_wallet_id" INTEGER NOT NULL,
    "from_solana_wallet_id" INTEGER NOT NULL,
    "transaction_cost" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NFTTransfer_pkey" PRIMARY KEY ("nft_transfer_id")
);

-- CreateTable
CREATE TABLE "SPL" (
    "spl_id" SERIAL NOT NULL,
    "nft_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SPL_pkey" PRIMARY KEY ("spl_id")
);

-- CreateTable
CREATE TABLE "SPLOwnership" (
    "spl_ownership_id" SERIAL NOT NULL,
    "spl_id" INTEGER NOT NULL,
    "token_account_id" INTEGER NOT NULL,
    "number_of_shares" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SPLOwnership_pkey" PRIMARY KEY ("spl_ownership_id")
);

-- CreateIndex
CREATE INDEX "nft_transfer__nft_id_idx" ON "NFTTransfer"("nft_id");

-- CreateIndex
CREATE INDEX "nft_transfer__to_solana_wallet_id_idx" ON "NFTTransfer"("to_solana_wallet_id");

-- CreateIndex
CREATE INDEX "nft_transfer__from_solana_wallet_id_idx" ON "NFTTransfer"("from_solana_wallet_id");

-- CreateIndex
CREATE INDEX "spl__nft_id_idx" ON "SPL"("nft_id");

-- CreateIndex
CREATE INDEX "spl_ownership__spl_id_idx" ON "SPLOwnership"("spl_id");

-- CreateIndex
CREATE INDEX "spl_ownership__token_account_id_idx" ON "SPLOwnership"("token_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "SPLOwnership_spl_id_token_account_id_key" ON "SPLOwnership"("spl_id", "token_account_id");

-- CreateIndex
CREATE INDEX "nft_ownership__solana_wallet_id_idx" ON "NFTOwnership"("solana_wallet_id");

-- CreateIndex
CREATE UNIQUE INDEX "NFTOwnership_nft_id_solana_wallet_id_key" ON "NFTOwnership"("nft_id", "solana_wallet_id");

-- CreateIndex
CREATE INDEX "spl_transfer__spl_id_idx" ON "SPLTransfer"("spl_id");

-- CreateIndex
CREATE INDEX "token_account__spl_id_idx" ON "TokenAccount"("spl_id");

-- CreateIndex
CREATE UNIQUE INDEX "TokenAccount_spl_id_solana_wallet_id_key" ON "TokenAccount"("spl_id", "solana_wallet_id");

-- AddForeignKey
ALTER TABLE "TokenAccount" ADD CONSTRAINT "TokenAccount_spl_id_fkey" FOREIGN KEY ("spl_id") REFERENCES "SPL"("spl_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NFTOwnership" ADD CONSTRAINT "NFTOwnership_solana_wallet_id_fkey" FOREIGN KEY ("solana_wallet_id") REFERENCES "SolanaWallet"("solana_wallet_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NFTTransfer" ADD CONSTRAINT "NFTTransfer_nft_id_fkey" FOREIGN KEY ("nft_id") REFERENCES "NFT"("nft_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NFTTransfer" ADD CONSTRAINT "NFTTransfer_to_solana_wallet_id_fkey" FOREIGN KEY ("to_solana_wallet_id") REFERENCES "SolanaWallet"("solana_wallet_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NFTTransfer" ADD CONSTRAINT "NFTTransfer_from_solana_wallet_id_fkey" FOREIGN KEY ("from_solana_wallet_id") REFERENCES "SolanaWallet"("solana_wallet_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SPL" ADD CONSTRAINT "SPL_nft_id_fkey" FOREIGN KEY ("nft_id") REFERENCES "NFT"("nft_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SPLOwnership" ADD CONSTRAINT "SPLOwnership_spl_id_fkey" FOREIGN KEY ("spl_id") REFERENCES "SPL"("spl_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SPLOwnership" ADD CONSTRAINT "SPLOwnership_token_account_id_fkey" FOREIGN KEY ("token_account_id") REFERENCES "TokenAccount"("token_account_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SPLTransfer" ADD CONSTRAINT "SPLTransfer_spl_id_fkey" FOREIGN KEY ("spl_id") REFERENCES "SPL"("spl_id") ON DELETE RESTRICT ON UPDATE CASCADE;
