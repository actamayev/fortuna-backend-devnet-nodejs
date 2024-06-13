/*
  Warnings:

  - You are about to drop the column `sol_transfer_id` on the `exclusive_video_access_purchase` table. All the data in the column will be lost.
  - You are about to drop the column `exclusive_video_access_purchase_id` on the `exclusive_video_access_purchase_fortuna_take` table. All the data in the column will be lost.
  - You are about to drop the column `is_exclusive_video_access_purchase` on the `sol_transfer` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[exclusive_video_access_purchase_sol_transfer_id]` on the table `exclusive_video_access_purchase` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[exclusive_video_access_purchase_fortuna_take_id]` on the table `exclusive_video_access_purchase` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `exclusive_video_access_purchase_fortuna_take_id` to the `exclusive_video_access_purchase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `exclusive_video_access_purchase_sol_transfer_id` to the `exclusive_video_access_purchase` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "exclusive_video_access_purchase" DROP CONSTRAINT "exclusive_video_access_purchase_sol_transfer_id_fkey";

-- DropForeignKey
ALTER TABLE "exclusive_video_access_purchase_fortuna_take" DROP CONSTRAINT "exclusive_video_access_purchase_fortuna_take_exclusive_vid_fkey";

-- DropIndex
DROP INDEX "exclusive_video_access_purchase__sol_transfer_id_idx";

-- DropIndex
DROP INDEX "exclusive_video_access_purchase_sol_transfer_id_key";

-- DropIndex
DROP INDEX "exclusive_video_access_purchase_fortuna_take_exclusive_vide_key";

-- DropIndex
DROP INDEX "fortuna_take__exclusive_video_access_purchase_id_idx";

-- AlterTable
ALTER TABLE "exclusive_video_access_purchase" DROP COLUMN "sol_transfer_id",
ADD COLUMN     "exclusive_video_access_purchase_fortuna_take_id" INTEGER NOT NULL,
ADD COLUMN     "exclusive_video_access_purchase_sol_transfer_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "exclusive_video_access_purchase_fortuna_take" DROP COLUMN "exclusive_video_access_purchase_id";

-- AlterTable
ALTER TABLE "sol_transfer" DROP COLUMN "is_exclusive_video_access_purchase";

-- CreateTable
CREATE TABLE "exclusive_video_access_purchase_sol_transfer" (
    "exclusive_video_access_purchase_sol_transfer_id" SERIAL NOT NULL,
    "fan_solana_wallet_id" INTEGER NOT NULL,
    "content_creator_solana_wallet_id" INTEGER NOT NULL,
    "transaction_signature" TEXT NOT NULL,
    "sol_amount_transferred" DOUBLE PRECISION NOT NULL,
    "usd_amount_transferred" DOUBLE PRECISION NOT NULL,
    "blockchain_fees_paid_by_fortuna_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "exclusive_video_access_purchase_sol_transfer_pkey" PRIMARY KEY ("exclusive_video_access_purchase_sol_transfer_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "exclusive_video_access_purchase_sol_transfer_blockchain_fee_key" ON "exclusive_video_access_purchase_sol_transfer"("blockchain_fees_paid_by_fortuna_id");

-- CreateIndex
CREATE INDEX "exc_vid_purchase_sol_transfer__fan_solana_wallet_id_idx" ON "exclusive_video_access_purchase_sol_transfer"("fan_solana_wallet_id");

-- CreateIndex
CREATE INDEX "exc_vid_purchase__content_creator_solana_wallet_id_idx" ON "exclusive_video_access_purchase_sol_transfer"("content_creator_solana_wallet_id");

-- CreateIndex
CREATE INDEX "exc_vid_purchase__blockchain_fees_paid_by_fortuna_id_idx" ON "exclusive_video_access_purchase_sol_transfer"("blockchain_fees_paid_by_fortuna_id");

-- CreateIndex
CREATE UNIQUE INDEX "unique_sol_transfer_id" ON "exclusive_video_access_purchase"("exclusive_video_access_purchase_sol_transfer_id");

-- CreateIndex
CREATE UNIQUE INDEX "unique_fortuna_take_id" ON "exclusive_video_access_purchase"("exclusive_video_access_purchase_fortuna_take_id");

-- CreateIndex
CREATE INDEX "exclusive_video_access__sol_transfer_id_idx" ON "exclusive_video_access_purchase"("exclusive_video_access_purchase_sol_transfer_id");

-- CreateIndex
CREATE INDEX "exclusive_video_access__take_id_idx" ON "exclusive_video_access_purchase"("exclusive_video_access_purchase_fortuna_take_id");

-- AddForeignKey
ALTER TABLE "exclusive_video_access_purchase" ADD CONSTRAINT "exclusive_video_access_purchase_sol_transfer_fkey" FOREIGN KEY ("exclusive_video_access_purchase_sol_transfer_id") REFERENCES "exclusive_video_access_purchase_sol_transfer"("exclusive_video_access_purchase_sol_transfer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exclusive_video_access_purchase" ADD CONSTRAINT "exclusive_video_access_purchase_fortuna_take_fkey" FOREIGN KEY ("exclusive_video_access_purchase_fortuna_take_id") REFERENCES "exclusive_video_access_purchase_fortuna_take"("exclusive_video_access_purchase_fortuna_take_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exclusive_video_access_purchase_sol_transfer" ADD CONSTRAINT "exclusive_video_access_purchase_sol_transfer_fan_solana_wa_fkey" FOREIGN KEY ("fan_solana_wallet_id") REFERENCES "solana_wallet"("solana_wallet_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exclusive_video_access_purchase_sol_transfer" ADD CONSTRAINT "exclusive_video_access_purchase_sol_transfer_content_creat_fkey" FOREIGN KEY ("content_creator_solana_wallet_id") REFERENCES "solana_wallet"("solana_wallet_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exclusive_video_access_purchase_sol_transfer" ADD CONSTRAINT "exclusive_video_access_purchase_sol_transfer_blockchain_fe_fkey" FOREIGN KEY ("blockchain_fees_paid_by_fortuna_id") REFERENCES "blockchain_fees_paid_by_fortuna"("blockchain_fees_paid_by_fortuna_id") ON DELETE RESTRICT ON UPDATE CASCADE;
