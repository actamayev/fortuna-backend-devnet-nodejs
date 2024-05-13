/*
  Warnings:

  - You are about to drop the column `fee_payer_solana_wallet_id` on the `spl_transfer` table. All the data in the column will be lost.
  - You are about to drop the column `transfer_fee_sol` on the `spl_transfer` table. All the data in the column will be lost.
  - You are about to drop the column `transfer_fee_usd` on the `spl_transfer` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "spl_transfer" DROP CONSTRAINT "spl_transfer_fee_payer_solana_wallet_id_fkey";

-- AlterTable
ALTER TABLE "spl_transfer" DROP COLUMN "fee_payer_solana_wallet_id",
DROP COLUMN "transfer_fee_sol",
DROP COLUMN "transfer_fee_usd";
