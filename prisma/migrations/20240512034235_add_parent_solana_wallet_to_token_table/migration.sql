/*
  Warnings:

  - Added the required column `parent_solana_wallet_id` to the `token_account` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "token_account" ADD COLUMN     "parent_solana_wallet_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "token_account" ADD CONSTRAINT "token_account_parent_solana_wallet_id_fkey" FOREIGN KEY ("parent_solana_wallet_id") REFERENCES "solana_wallet"("solana_wallet_id") ON DELETE RESTRICT ON UPDATE CASCADE;
