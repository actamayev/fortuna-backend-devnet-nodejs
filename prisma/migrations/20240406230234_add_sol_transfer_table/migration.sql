/*
  Warnings:

  - You are about to alter the column `public_key` on the `token_account` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.

*/
-- AlterTable
ALTER TABLE "token_account" ALTER COLUMN "public_key" SET DATA TYPE VARCHAR(255);

-- CreateTable
CREATE TABLE "sol_transfer" (
    "sol_transfer_id" SERIAL NOT NULL,
    "recipient_public_key" VARCHAR(255) NOT NULL,
    "is_recipient_fortuna_user" BOOLEAN NOT NULL,
    "transaction_signature" TEXT NOT NULL,
    "sol_transferred" DOUBLE PRECISION NOT NULL,
    "usd_transferred" DOUBLE PRECISION NOT NULL,
    "transfer_fee_sol" DOUBLE PRECISION NOT NULL,
    "transfer_fee_usd" DOUBLE PRECISION NOT NULL,
    "sender_wallet_id" INTEGER NOT NULL,
    "payer_solana_wallet_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sol_transfer_pkey" PRIMARY KEY ("sol_transfer_id")
);

-- CreateIndex
CREATE INDEX "sol_transfer__parent_solana_wallet_id_idx" ON "sol_transfer"("sender_wallet_id");

-- CreateIndex
CREATE INDEX "sol_transfer__payer_solana_wallet_id_idx" ON "sol_transfer"("payer_solana_wallet_id");

-- AddForeignKey
ALTER TABLE "sol_transfer" ADD CONSTRAINT "sol_transfer_sender_wallet_id_fkey" FOREIGN KEY ("sender_wallet_id") REFERENCES "solana_wallet"("solana_wallet_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sol_transfer" ADD CONSTRAINT "sol_transfer_payer_solana_wallet_id_fkey" FOREIGN KEY ("payer_solana_wallet_id") REFERENCES "solana_wallet"("solana_wallet_id") ON DELETE RESTRICT ON UPDATE CASCADE;
