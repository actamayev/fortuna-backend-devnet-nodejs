/*
  Warnings:

  - A unique constraint covering the columns `[blockchain_fees_paid_by_user_id]` on the table `sol_transfer` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "sol_transfer" DROP CONSTRAINT "sol_transfer_blockchain_fees_paid_by_fortuna_id_fkey";

-- AlterTable
ALTER TABLE "sol_transfer" ADD COLUMN     "blockchain_fees_paid_by_user_id" INTEGER,
ALTER COLUMN "blockchain_fees_paid_by_fortuna_id" DROP NOT NULL;

-- CreateTable
CREATE TABLE "blockchain_fees_paid_by_user" (
    "blockchain_fees_paid_by_user_id" SERIAL NOT NULL,
    "fee_in_sol" DOUBLE PRECISION,
    "fee_in_usd" DOUBLE PRECISION,
    "fee_payer_solana_wallet_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "blockchain_fees_paid_by_user_pkey" PRIMARY KEY ("blockchain_fees_paid_by_user_id")
);

-- CreateIndex
CREATE INDEX "blockchain_fees_paid_by_user__fee_payer_solana_wallet_idx" ON "blockchain_fees_paid_by_user"("fee_payer_solana_wallet_id");

-- CreateIndex
CREATE UNIQUE INDEX "sol_transfer_blockchain_fees_paid_by_user_id_key" ON "sol_transfer"("blockchain_fees_paid_by_user_id");

-- CreateIndex
CREATE INDEX "sol_transfer__blockchain_fees_paid_by_user_id_idx" ON "sol_transfer"("blockchain_fees_paid_by_user_id");

-- AddForeignKey
ALTER TABLE "sol_transfer" ADD CONSTRAINT "sol_transfer_blockchain_fees_paid_by_fortuna_id_fkey" FOREIGN KEY ("blockchain_fees_paid_by_fortuna_id") REFERENCES "blockchain_fees_paid_by_fortuna"("blockchain_fees_paid_by_fortuna_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sol_transfer" ADD CONSTRAINT "sol_transfer_blockchain_fees_paid_by_user_id_fkey" FOREIGN KEY ("blockchain_fees_paid_by_user_id") REFERENCES "blockchain_fees_paid_by_user"("blockchain_fees_paid_by_user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blockchain_fees_paid_by_user" ADD CONSTRAINT "blockchain_fees_paid_by_user_fee_payer_solana_wallet_id_fkey" FOREIGN KEY ("fee_payer_solana_wallet_id") REFERENCES "solana_wallet"("solana_wallet_id") ON DELETE RESTRICT ON UPDATE CASCADE;
