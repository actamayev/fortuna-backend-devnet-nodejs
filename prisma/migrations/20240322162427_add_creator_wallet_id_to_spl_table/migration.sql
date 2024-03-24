/*
  Warnings:

  - Added the required column `creator_wallet_id` to the `spl` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "spl" ADD COLUMN     "creator_wallet_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "spl" ADD CONSTRAINT "spl_creator_wallet_id_fkey" FOREIGN KEY ("creator_wallet_id") REFERENCES "solana_wallet"("solana_wallet_id") ON DELETE RESTRICT ON UPDATE CASCADE;
