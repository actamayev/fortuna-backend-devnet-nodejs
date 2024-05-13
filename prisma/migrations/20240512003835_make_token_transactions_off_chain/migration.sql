/*
  Warnings:

  - You are about to drop the column `token_account_id` on the `spl_ownership` table. All the data in the column will be lost.
  - You are about to drop the column `recipient_token_account_id` on the `spl_transfer` table. All the data in the column will be lost.
  - You are about to drop the column `sender_token_account_id` on the `spl_transfer` table. All the data in the column will be lost.
  - You are about to drop the column `parent_solana_wallet_id` on the `token_account` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[spl_id,solana_wallet_id]` on the table `spl_ownership` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `solana_wallet_id` to the `spl_ownership` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "spl_ownership" DROP CONSTRAINT "spl_ownership_token_account_id_fkey";

-- DropForeignKey
ALTER TABLE "spl_transfer" DROP CONSTRAINT "spl_transfer_recipient_token_account_id_fkey";

-- DropForeignKey
ALTER TABLE "spl_transfer" DROP CONSTRAINT "spl_transfer_sender_token_account_id_fkey";

-- DropForeignKey
ALTER TABLE "token_account" DROP CONSTRAINT "token_account_parent_solana_wallet_id_fkey";

-- DropIndex
DROP INDEX "spl_ownership__token_account_id_idx";

-- DropIndex
DROP INDEX "spl_ownership_spl_id_token_account_id_key";

-- DropIndex
DROP INDEX "token_account__parent_solana_wallet_id_idx";

-- DropIndex
DROP INDEX "token_account_spl_id_parent_solana_wallet_id_key";

-- AlterTable
ALTER TABLE "spl_ownership" DROP COLUMN "token_account_id",
ADD COLUMN     "solana_wallet_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "spl_transfer" DROP COLUMN "recipient_token_account_id",
DROP COLUMN "sender_token_account_id";

-- AlterTable
ALTER TABLE "token_account" DROP COLUMN "parent_solana_wallet_id";

-- CreateIndex
CREATE INDEX "spl_ownership__solana_wallet_id_idx" ON "spl_ownership"("solana_wallet_id");

-- CreateIndex
CREATE UNIQUE INDEX "spl_ownership_spl_id_solana_wallet_id_key" ON "spl_ownership"("spl_id", "solana_wallet_id");

-- AddForeignKey
ALTER TABLE "spl_ownership" ADD CONSTRAINT "spl_ownership_solana_wallet_id_fkey" FOREIGN KEY ("solana_wallet_id") REFERENCES "solana_wallet"("solana_wallet_id") ON DELETE RESTRICT ON UPDATE CASCADE;
