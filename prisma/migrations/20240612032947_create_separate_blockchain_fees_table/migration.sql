/*
  Warnings:

  - You are about to drop the column `fee_payer_solana_wallet_id` on the `sol_transfer` table. All the data in the column will be lost.
  - You are about to drop the column `transfer_fee_sol` on the `sol_transfer` table. All the data in the column will be lost.
  - You are about to drop the column `transfer_fee_usd` on the `sol_transfer` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[blockchain_fees_paid_by_fortuna_id]` on the table `sol_transfer` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `blockchain_fees_paid_by_fortuna_id` to the `sol_transfer` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "sol_transfer" DROP CONSTRAINT "sol_transfer_fee_payer_solana_wallet_id_fkey";

-- DropIndex
DROP INDEX "sol_transfer__fee_payer_solana_wallet_id_idx";

-- AlterTable
ALTER TABLE "sol_transfer" DROP COLUMN "fee_payer_solana_wallet_id",
DROP COLUMN "transfer_fee_sol",
DROP COLUMN "transfer_fee_usd",
ADD COLUMN     "blockchain_fees_paid_by_fortuna_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "exclusive_video_access_purchase_fortuna_take" (
    "exclusive_video_access_purchase_fortuna_take_id" SERIAL NOT NULL,
    "sender_solana_wallet_id" INTEGER NOT NULL,
    "fortuna_recipient_solana_wallet_id" INTEGER NOT NULL,
    "transaction_signature" TEXT NOT NULL,
    "sol_amount_transferred" DOUBLE PRECISION NOT NULL,
    "usd_amount_transferred" DOUBLE PRECISION NOT NULL,
    "exclusive_video_access_purchase_id" INTEGER NOT NULL,
    "blockchain_fees_paid_by_fortuna_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "exclusive_video_access_purchase_fortuna_take_pkey" PRIMARY KEY ("exclusive_video_access_purchase_fortuna_take_id")
);

-- CreateTable
CREATE TABLE "blockchain_fees_paid_by_fortuna" (
    "blockchain_fees_paid_by_fortuna_id" SERIAL NOT NULL,
    "fee_in_sol" DOUBLE PRECISION NOT NULL,
    "fee_in_usd" DOUBLE PRECISION NOT NULL,
    "fee_payer_solana_wallet_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "blockchain_fees_paid_by_fortuna_pkey" PRIMARY KEY ("blockchain_fees_paid_by_fortuna_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "exclusive_video_access_purchase_fortuna_take_exclusive_vide_key" ON "exclusive_video_access_purchase_fortuna_take"("exclusive_video_access_purchase_id");

-- CreateIndex
CREATE UNIQUE INDEX "exclusive_video_access_purchase_fortuna_take_blockchain_fee_key" ON "exclusive_video_access_purchase_fortuna_take"("blockchain_fees_paid_by_fortuna_id");

-- CreateIndex
CREATE INDEX "fortuna_take__sender_solana_wallet_id_idx" ON "exclusive_video_access_purchase_fortuna_take"("sender_solana_wallet_id");

-- CreateIndex
CREATE INDEX "fortuna_take__fortuna_recipient_solana_wallet_id_idx" ON "exclusive_video_access_purchase_fortuna_take"("fortuna_recipient_solana_wallet_id");

-- CreateIndex
CREATE INDEX "fortuna_take__exclusive_video_access_purchase_id_idx" ON "exclusive_video_access_purchase_fortuna_take"("exclusive_video_access_purchase_id");

-- CreateIndex
CREATE INDEX "fortuna_take__blockchain_fees_paid_by_fortuna_id_idx" ON "exclusive_video_access_purchase_fortuna_take"("blockchain_fees_paid_by_fortuna_id");

-- CreateIndex
CREATE INDEX "blockchain_fees_paid_by_fortuna__fee_payer_solana_wallet_idx" ON "blockchain_fees_paid_by_fortuna"("fee_payer_solana_wallet_id");

-- CreateIndex
CREATE UNIQUE INDEX "sol_transfer_blockchain_fees_paid_by_fortuna_id_key" ON "sol_transfer"("blockchain_fees_paid_by_fortuna_id");

-- CreateIndex
CREATE INDEX "sol_transfer__blockchain_fees_paid_by_fortuna_id_idx" ON "sol_transfer"("blockchain_fees_paid_by_fortuna_id");

-- CreateIndex
CREATE INDEX "video__uploaded_video_id_idx" ON "video"("uploaded_video_id");

-- AddForeignKey
ALTER TABLE "sol_transfer" ADD CONSTRAINT "sol_transfer_blockchain_fees_paid_by_fortuna_id_fkey" FOREIGN KEY ("blockchain_fees_paid_by_fortuna_id") REFERENCES "blockchain_fees_paid_by_fortuna"("blockchain_fees_paid_by_fortuna_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exclusive_video_access_purchase_fortuna_take" ADD CONSTRAINT "exclusive_video_access_purchase_fortuna_take_sender_solana_fkey" FOREIGN KEY ("sender_solana_wallet_id") REFERENCES "solana_wallet"("solana_wallet_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exclusive_video_access_purchase_fortuna_take" ADD CONSTRAINT "exclusive_video_access_purchase_fortuna_take_fortuna_recip_fkey" FOREIGN KEY ("fortuna_recipient_solana_wallet_id") REFERENCES "solana_wallet"("solana_wallet_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exclusive_video_access_purchase_fortuna_take" ADD CONSTRAINT "exclusive_video_access_purchase_fortuna_take_exclusive_vid_fkey" FOREIGN KEY ("exclusive_video_access_purchase_id") REFERENCES "exclusive_video_access_purchase"("exclusive_video_access_purchase_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exclusive_video_access_purchase_fortuna_take" ADD CONSTRAINT "exclusive_video_access_purchase_fortuna_take_blockchain_fe_fkey" FOREIGN KEY ("blockchain_fees_paid_by_fortuna_id") REFERENCES "blockchain_fees_paid_by_fortuna"("blockchain_fees_paid_by_fortuna_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blockchain_fees_paid_by_fortuna" ADD CONSTRAINT "blockchain_fees_paid_by_fortuna_fee_payer_solana_wallet_id_fkey" FOREIGN KEY ("fee_payer_solana_wallet_id") REFERENCES "solana_wallet"("solana_wallet_id") ON DELETE RESTRICT ON UPDATE CASCADE;
