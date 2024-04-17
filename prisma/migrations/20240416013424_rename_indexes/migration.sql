/*
  Warnings:

  - You are about to drop the column `payer_solana_wallet_id` on the `sol_transfer` table. All the data in the column will be lost.
  - You are about to drop the column `create_spl_metadata_payer_solana_wallet_id` on the `spl` table. All the data in the column will be lost.
  - You are about to drop the column `create_spl_payer_solana_wallet_id` on the `spl` table. All the data in the column will be lost.
  - You are about to drop the column `payer_solana_wallet_id` on the `spl_mint` table. All the data in the column will be lost.
  - You are about to drop the column `payer_solana_wallet_id` on the `token_account` table. All the data in the column will be lost.
  - Added the required column `fee_payer_solana_wallet_id` to the `sol_transfer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `create_spl_fee_payer_solana_wallet_id` to the `spl` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fee_payer_solana_wallet_id` to the `spl_mint` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fee_payer_solana_wallet_id` to the `token_account` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "sol_transfer" DROP CONSTRAINT "sol_transfer_payer_solana_wallet_id_fkey";

-- DropForeignKey
ALTER TABLE "spl" DROP CONSTRAINT "spl_create_spl_metadata_payer_solana_wallet_id_fkey";

-- DropForeignKey
ALTER TABLE "spl" DROP CONSTRAINT "spl_create_spl_payer_solana_wallet_id_fkey";

-- DropForeignKey
ALTER TABLE "spl_mint" DROP CONSTRAINT "spl_mint_payer_solana_wallet_id_fkey";

-- DropForeignKey
ALTER TABLE "token_account" DROP CONSTRAINT "token_account_payer_solana_wallet_id_fkey";

-- DropIndex
DROP INDEX "sol_transfer__payer_solana_wallet_id_idx";

-- DropIndex
DROP INDEX "spl__create_spl_metadata_payer_solana_wallet_id_idx";

-- DropIndex
DROP INDEX "spl__create_spl_payer_solana_wallet_id_idx";

-- DropIndex
DROP INDEX "spl_mint__payer_solana_wallet_id_idx";

-- DropIndex
DROP INDEX "token_account__payer_solana_wallet_id_idx";

-- AlterTable
ALTER TABLE "sol_transfer" DROP COLUMN "payer_solana_wallet_id",
ADD COLUMN     "fee_payer_solana_wallet_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "spl" DROP COLUMN "create_spl_metadata_payer_solana_wallet_id",
DROP COLUMN "create_spl_payer_solana_wallet_id",
ADD COLUMN     "create_spl_fee_payer_solana_wallet_id" INTEGER NOT NULL,
ADD COLUMN     "create_spl_metadata_fee_payer_solana_wallet_id" INTEGER;

-- AlterTable
ALTER TABLE "spl_mint" DROP COLUMN "payer_solana_wallet_id",
ADD COLUMN     "fee_payer_solana_wallet_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "token_account" DROP COLUMN "payer_solana_wallet_id",
ADD COLUMN     "fee_payer_solana_wallet_id" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "sol_transfer__fee_payer_solana_wallet_id_idx" ON "sol_transfer"("fee_payer_solana_wallet_id");

-- CreateIndex
CREATE INDEX "spl__create_spl_fee_payer_solana_wallet_id_idx" ON "spl"("create_spl_fee_payer_solana_wallet_id");

-- CreateIndex
CREATE INDEX "spl__create_spl_metadata_fee_payer_solana_wallet_id_idx" ON "spl"("create_spl_metadata_fee_payer_solana_wallet_id");

-- CreateIndex
CREATE INDEX "spl_mint__fee_payer_solana_wallet_id_idx" ON "spl_mint"("fee_payer_solana_wallet_id");

-- CreateIndex
CREATE INDEX "token_account__fee_payer_solana_wallet_id_idx" ON "token_account"("fee_payer_solana_wallet_id");

-- AddForeignKey
ALTER TABLE "token_account" ADD CONSTRAINT "token_account_fee_payer_solana_wallet_id_fkey" FOREIGN KEY ("fee_payer_solana_wallet_id") REFERENCES "solana_wallet"("solana_wallet_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spl" ADD CONSTRAINT "spl_create_spl_fee_payer_solana_wallet_id_fkey" FOREIGN KEY ("create_spl_fee_payer_solana_wallet_id") REFERENCES "solana_wallet"("solana_wallet_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spl" ADD CONSTRAINT "spl_create_spl_metadata_fee_payer_solana_wallet_id_fkey" FOREIGN KEY ("create_spl_metadata_fee_payer_solana_wallet_id") REFERENCES "solana_wallet"("solana_wallet_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spl_mint" ADD CONSTRAINT "spl_mint_fee_payer_solana_wallet_id_fkey" FOREIGN KEY ("fee_payer_solana_wallet_id") REFERENCES "solana_wallet"("solana_wallet_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sol_transfer" ADD CONSTRAINT "sol_transfer_fee_payer_solana_wallet_id_fkey" FOREIGN KEY ("fee_payer_solana_wallet_id") REFERENCES "solana_wallet"("solana_wallet_id") ON DELETE RESTRICT ON UPDATE CASCADE;
