/*
  Warnings:

  - You are about to drop the column `solana_wallet_id` on the `token_account` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[spl_id,parent_solana_wallet_id]` on the table `token_account` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `parent_solana_wallet_id` to the `token_account` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "token_account" DROP CONSTRAINT "token_account_solana_wallet_id_fkey";

-- DropIndex
DROP INDEX "token_account__solana_wallet_id_idx";

-- DropIndex
DROP INDEX "token_account_spl_id_solana_wallet_id_key";

-- AlterTable
ALTER TABLE "token_account" DROP COLUMN "solana_wallet_id",
ADD COLUMN     "parent_solana_wallet_id" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "token_account__parent_solana_wallet_id_idx" ON "token_account"("parent_solana_wallet_id");

-- CreateIndex
CREATE UNIQUE INDEX "token_account_spl_id_parent_solana_wallet_id_key" ON "token_account"("spl_id", "parent_solana_wallet_id");

-- AddForeignKey
ALTER TABLE "token_account" ADD CONSTRAINT "token_account_parent_solana_wallet_id_fkey" FOREIGN KEY ("parent_solana_wallet_id") REFERENCES "solana_wallet"("solana_wallet_id") ON DELETE RESTRICT ON UPDATE CASCADE;
