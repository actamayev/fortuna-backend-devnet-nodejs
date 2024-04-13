/*
  Warnings:

  - You are about to drop the column `sender_wallet_id` on the `sol_transfer` table. All the data in the column will be lost.
  - Added the required column `sender_solana_wallet_id` to the `sol_transfer` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "sol_transfer" DROP CONSTRAINT "sol_transfer_sender_wallet_id_fkey";

-- DropIndex
DROP INDEX "sol_transfer__parent_solana_wallet_id_idx";

-- AlterTable
ALTER TABLE "sol_transfer" DROP COLUMN "sender_wallet_id",
ADD COLUMN     "recipient_solana_wallet_id" INTEGER,
ADD COLUMN     "sender_solana_wallet_id" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "sol_transfer__sender_solana_wallet_id_idx" ON "sol_transfer"("sender_solana_wallet_id");

-- CreateIndex
CREATE INDEX "sol_transfer__recipient_solana_wallet_id_idx" ON "sol_transfer"("recipient_solana_wallet_id");

-- AddForeignKey
ALTER TABLE "sol_transfer" ADD CONSTRAINT "sol_transfer_sender_solana_wallet_id_fkey" FOREIGN KEY ("sender_solana_wallet_id") REFERENCES "solana_wallet"("solana_wallet_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sol_transfer" ADD CONSTRAINT "sol_transfer_recipient_solana_wallet_id_fkey" FOREIGN KEY ("recipient_solana_wallet_id") REFERENCES "solana_wallet"("solana_wallet_id") ON DELETE SET NULL ON UPDATE CASCADE;
