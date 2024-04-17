/*
  Warnings:

  - You are about to drop the column `sol_transferred` on the `sol_transfer` table. All the data in the column will be lost.
  - You are about to drop the column `usd_transferred` on the `sol_transfer` table. All the data in the column will be lost.
  - You are about to drop the column `number_shares_purchased` on the `spl_purchase` table. All the data in the column will be lost.
  - You are about to drop the column `payer_solana_wallet_id` on the `spl_purchase` table. All the data in the column will be lost.
  - You are about to drop the column `purchaser_solana_wallet_id` on the `spl_purchase` table. All the data in the column will be lost.
  - You are about to drop the column `purchaser_token_account_id` on the `spl_purchase` table. All the data in the column will be lost.
  - You are about to drop the column `recipient_solana_wallet_id` on the `spl_purchase` table. All the data in the column will be lost.
  - You are about to drop the column `sol_paid_per_share` on the `spl_purchase` table. All the data in the column will be lost.
  - You are about to drop the column `spl_mint_id` on the `spl_purchase` table. All the data in the column will be lost.
  - You are about to drop the column `usd_paid_per_share` on the `spl_purchase` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[spl_transfer_id]` on the table `spl_purchase` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `is_spl_purchase` to the `sol_transfer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sol_amount_transferred` to the `sol_transfer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usd_amount_transferred` to the `sol_transfer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `spl_transfer_id` to the `spl_purchase` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "spl_purchase" DROP CONSTRAINT "spl_purchase_payer_solana_wallet_id_fkey";

-- DropForeignKey
ALTER TABLE "spl_purchase" DROP CONSTRAINT "spl_purchase_purchaser_solana_wallet_id_fkey";

-- DropForeignKey
ALTER TABLE "spl_purchase" DROP CONSTRAINT "spl_purchase_purchaser_token_account_id_fkey";

-- DropForeignKey
ALTER TABLE "spl_purchase" DROP CONSTRAINT "spl_purchase_recipient_solana_wallet_id_fkey";

-- DropForeignKey
ALTER TABLE "spl_purchase" DROP CONSTRAINT "spl_purchase_spl_mint_id_fkey";

-- DropIndex
DROP INDEX "spl_purchase__payer_solana_wallet_id_idx";

-- DropIndex
DROP INDEX "spl_purchase__purchaser_solana_wallet_id_idx";

-- DropIndex
DROP INDEX "spl_purchase__spl_mint_id_idx";

-- DropIndex
DROP INDEX "spl_purchase_spl_mint_id_key";

-- AlterTable
ALTER TABLE "sol_transfer" DROP COLUMN "sol_transferred",
DROP COLUMN "usd_transferred",
ADD COLUMN     "is_spl_purchase" BOOLEAN NOT NULL,
ADD COLUMN     "sol_amount_transferred" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "usd_amount_transferred" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "spl_purchase" DROP COLUMN "number_shares_purchased",
DROP COLUMN "payer_solana_wallet_id",
DROP COLUMN "purchaser_solana_wallet_id",
DROP COLUMN "purchaser_token_account_id",
DROP COLUMN "recipient_solana_wallet_id",
DROP COLUMN "sol_paid_per_share",
DROP COLUMN "spl_mint_id",
DROP COLUMN "usd_paid_per_share",
ADD COLUMN     "spl_transfer_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "spl_transfer" (
    "spl_transfer_id" SERIAL NOT NULL,
    "spl_id" INTEGER NOT NULL,
    "recipient_solana_wallet_id" INTEGER NOT NULL,
    "recipient_token_account_id" INTEGER NOT NULL,
    "sender_solana_wallet_id" INTEGER NOT NULL,
    "sender_token_account_id" INTEGER NOT NULL,
    "is_spl_purchase" BOOLEAN NOT NULL,
    "number_spl_shares_transferred" INTEGER NOT NULL,
    "transfer_fee_sol" DOUBLE PRECISION NOT NULL,
    "transfer_fee_usd" DOUBLE PRECISION NOT NULL,
    "fee_payer_solana_wallet_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "spl_transfer_pkey" PRIMARY KEY ("spl_transfer_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "spl_purchase_spl_transfer_id_key" ON "spl_purchase"("spl_transfer_id");

-- CreateIndex
CREATE INDEX "spl_purchase__spl_transfer_id_idx" ON "spl_purchase"("spl_transfer_id");

-- AddForeignKey
ALTER TABLE "spl_transfer" ADD CONSTRAINT "spl_transfer_spl_id_fkey" FOREIGN KEY ("spl_id") REFERENCES "spl"("spl_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spl_transfer" ADD CONSTRAINT "spl_transfer_recipient_solana_wallet_id_fkey" FOREIGN KEY ("recipient_solana_wallet_id") REFERENCES "solana_wallet"("solana_wallet_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spl_transfer" ADD CONSTRAINT "spl_transfer_sender_solana_wallet_id_fkey" FOREIGN KEY ("sender_solana_wallet_id") REFERENCES "solana_wallet"("solana_wallet_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spl_transfer" ADD CONSTRAINT "spl_transfer_fee_payer_solana_wallet_id_fkey" FOREIGN KEY ("fee_payer_solana_wallet_id") REFERENCES "solana_wallet"("solana_wallet_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spl_transfer" ADD CONSTRAINT "spl_transfer_recipient_token_account_id_fkey" FOREIGN KEY ("recipient_token_account_id") REFERENCES "token_account"("token_account_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spl_transfer" ADD CONSTRAINT "spl_transfer_sender_token_account_id_fkey" FOREIGN KEY ("sender_token_account_id") REFERENCES "token_account"("token_account_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spl_purchase" ADD CONSTRAINT "spl_purchase_spl_transfer_id_fkey" FOREIGN KEY ("spl_transfer_id") REFERENCES "spl_transfer"("spl_transfer_id") ON DELETE RESTRICT ON UPDATE CASCADE;
