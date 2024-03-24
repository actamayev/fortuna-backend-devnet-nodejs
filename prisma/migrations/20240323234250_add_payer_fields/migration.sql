/*
  Warnings:

  - You are about to drop the column `payer_solana_wallet_id` on the `spl` table. All the data in the column will be lost.
  - You are about to drop the column `spl_mint_fee_dollars` on the `spl_mint` table. All the data in the column will be lost.
  - You are about to drop the column `spl_mint_fee_dollars` on the `spl_transfer` table. All the data in the column will be lost.
  - You are about to drop the column `spl_mint_fee_sol` on the `spl_transfer` table. All the data in the column will be lost.
  - Added the required column `create_spl_metadata_payer_solana_wallet_id` to the `spl` table without a default value. This is not possible if the table is not empty.
  - Added the required column `create_spl_payer_solana_wallet_id` to the `spl` table without a default value. This is not possible if the table is not empty.
  - Added the required column `spl_creation_fee_sol` to the `spl` table without a default value. This is not possible if the table is not empty.
  - Added the required column `spl_creation_fee_usd` to the `spl` table without a default value. This is not possible if the table is not empty.
  - Added the required column `spl_metadata_creation_fee_sol` to the `spl` table without a default value. This is not possible if the table is not empty.
  - Added the required column `spl_metadata_creation_fee_usd` to the `spl` table without a default value. This is not possible if the table is not empty.
  - Added the required column `spl_mint_fee_usd` to the `spl_mint` table without a default value. This is not possible if the table is not empty.
  - Added the required column `spl_transfer_fee_sol` to the `spl_transfer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `spl_transfer_fee_usd` to the `spl_transfer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payer_solana_wallet_id` to the `token_account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `token_account_creation_fee_sol` to the `token_account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `token_account_creation_fee_usd` to the `token_account` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "spl" DROP CONSTRAINT "spl_payer_solana_wallet_id_fkey";

-- DropIndex
DROP INDEX "spl__payer_solana_wallet_id_idx";

-- AlterTable
ALTER TABLE "spl" DROP COLUMN "payer_solana_wallet_id",
ADD COLUMN     "create_spl_metadata_payer_solana_wallet_id" INTEGER NOT NULL,
ADD COLUMN     "create_spl_payer_solana_wallet_id" INTEGER NOT NULL,
ADD COLUMN     "spl_creation_fee_sol" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "spl_creation_fee_usd" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "spl_metadata_creation_fee_sol" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "spl_metadata_creation_fee_usd" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "spl_mint" DROP COLUMN "spl_mint_fee_dollars",
ADD COLUMN     "spl_mint_fee_usd" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "spl_transfer" DROP COLUMN "spl_mint_fee_dollars",
DROP COLUMN "spl_mint_fee_sol",
ADD COLUMN     "spl_transfer_fee_sol" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "spl_transfer_fee_usd" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "token_account" ADD COLUMN     "payer_solana_wallet_id" INTEGER NOT NULL,
ADD COLUMN     "token_account_creation_fee_sol" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "token_account_creation_fee_usd" DOUBLE PRECISION NOT NULL;

-- CreateIndex
CREATE INDEX "spl__create_spl_payer_solana_wallet_id_idx" ON "spl"("create_spl_payer_solana_wallet_id");

-- CreateIndex
CREATE INDEX "spl__create_spl_metadata_payer_solana_wallet_id_idx" ON "spl"("create_spl_metadata_payer_solana_wallet_id");

-- CreateIndex
CREATE INDEX "spl__creator_wallet_id_idx" ON "spl"("creator_wallet_id");

-- CreateIndex
CREATE INDEX "token_account__payer_solana_wallet_id_idx" ON "token_account"("payer_solana_wallet_id");

-- AddForeignKey
ALTER TABLE "token_account" ADD CONSTRAINT "token_account_payer_solana_wallet_id_fkey" FOREIGN KEY ("payer_solana_wallet_id") REFERENCES "solana_wallet"("solana_wallet_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spl" ADD CONSTRAINT "spl_create_spl_payer_solana_wallet_id_fkey" FOREIGN KEY ("create_spl_payer_solana_wallet_id") REFERENCES "solana_wallet"("solana_wallet_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spl" ADD CONSTRAINT "spl_create_spl_metadata_payer_solana_wallet_id_fkey" FOREIGN KEY ("create_spl_metadata_payer_solana_wallet_id") REFERENCES "solana_wallet"("solana_wallet_id") ON DELETE RESTRICT ON UPDATE CASCADE;
