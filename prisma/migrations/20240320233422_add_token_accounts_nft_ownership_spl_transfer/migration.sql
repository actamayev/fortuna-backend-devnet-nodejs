/*
  Warnings:

  - You are about to drop the column `wallet_id` on the `NFT` table. All the data in the column will be lost.
  - Added the required column `solana_wallet_id` to the `NFT` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "NFT" DROP CONSTRAINT "NFT_wallet_id_fkey";

-- DropIndex
DROP INDEX "nft_walletId_idx";

-- AlterTable
ALTER TABLE "NFT" DROP COLUMN "wallet_id",
ADD COLUMN     "solana_wallet_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "TokenAccount" (
    "token_account_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "solana_wallet_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TokenAccount_pkey" PRIMARY KEY ("token_account_id")
);

-- CreateTable
CREATE TABLE "NFTOwnership" (
    "nft_ownership_id" SERIAL NOT NULL,
    "nft_id" INTEGER NOT NULL,
    "token_account_id" INTEGER NOT NULL,
    "number_of_shares" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NFTOwnership_pkey" PRIMARY KEY ("nft_ownership_id")
);

-- CreateTable
CREATE TABLE "SPLTransfer" (
    "spl_transfer_id" SERIAL NOT NULL,
    "nft_id" INTEGER NOT NULL,
    "to_token_account_id" INTEGER NOT NULL,
    "from_token_account_id" INTEGER NOT NULL,
    "number_of_shares" INTEGER NOT NULL,
    "transaction_cost" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SPLTransfer_pkey" PRIMARY KEY ("spl_transfer_id")
);

-- CreateIndex
CREATE INDEX "token_account__user_id_idx" ON "TokenAccount"("user_id");

-- CreateIndex
CREATE INDEX "token_account__solana_wallet_id_idx" ON "TokenAccount"("solana_wallet_id");

-- CreateIndex
CREATE INDEX "nft_ownership__token_account_id_idx" ON "NFTOwnership"("token_account_id");

-- CreateIndex
CREATE INDEX "nft_ownership__nft_id_idx" ON "NFTOwnership"("nft_id");

-- CreateIndex
CREATE UNIQUE INDEX "NFTOwnership_nft_id_token_account_id_key" ON "NFTOwnership"("nft_id", "token_account_id");

-- CreateIndex
CREATE INDEX "spl_transfer__nft_id_idx" ON "SPLTransfer"("nft_id");

-- CreateIndex
CREATE INDEX "spl_transfer__to_token_account_id_idx" ON "SPLTransfer"("to_token_account_id");

-- CreateIndex
CREATE INDEX "spl_transfer__from_token_account_id_idx" ON "SPLTransfer"("from_token_account_id");

-- CreateIndex
CREATE INDEX "nft__solana_wallet_id_idx" ON "NFT"("solana_wallet_id");

-- AddForeignKey
ALTER TABLE "NFT" ADD CONSTRAINT "NFT_solana_wallet_id_fkey" FOREIGN KEY ("solana_wallet_id") REFERENCES "SolanaWallet"("solana_wallet_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TokenAccount" ADD CONSTRAINT "TokenAccount_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Credentials"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TokenAccount" ADD CONSTRAINT "TokenAccount_solana_wallet_id_fkey" FOREIGN KEY ("solana_wallet_id") REFERENCES "SolanaWallet"("solana_wallet_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NFTOwnership" ADD CONSTRAINT "NFTOwnership_token_account_id_fkey" FOREIGN KEY ("token_account_id") REFERENCES "TokenAccount"("token_account_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NFTOwnership" ADD CONSTRAINT "NFTOwnership_nft_id_fkey" FOREIGN KEY ("nft_id") REFERENCES "NFT"("nft_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SPLTransfer" ADD CONSTRAINT "SPLTransfer_to_token_account_id_fkey" FOREIGN KEY ("to_token_account_id") REFERENCES "TokenAccount"("token_account_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SPLTransfer" ADD CONSTRAINT "SPLTransfer_from_token_account_id_fkey" FOREIGN KEY ("from_token_account_id") REFERENCES "TokenAccount"("token_account_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SPLTransfer" ADD CONSTRAINT "SPLTransfer_nft_id_fkey" FOREIGN KEY ("nft_id") REFERENCES "NFT"("nft_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "user_id_idx" RENAME TO "login_history__user_id_idx";

-- RenameIndex
ALTER INDEX "nft_userId_idx" RENAME TO "nft__user_id_idx";

-- RenameIndex
ALTER INDEX "userId_idx" RENAME TO "solana_wallet__user_id_idx";
