/*
  Warnings:

  - You are about to drop the `spl_transfer` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[user_id]` on the table `solana_wallet` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "solana_wallet" DROP CONSTRAINT "solana_wallet_user_id_fkey";

-- DropForeignKey
ALTER TABLE "spl_transfer" DROP CONSTRAINT "spl_transfer_payer_solana_wallet_id_fkey";

-- DropForeignKey
ALTER TABLE "spl_transfer" DROP CONSTRAINT "spl_transfer_recipient_token_account_id_fkey";

-- DropForeignKey
ALTER TABLE "spl_transfer" DROP CONSTRAINT "spl_transfer_sender_token_account_id_fkey";

-- DropForeignKey
ALTER TABLE "spl_transfer" DROP CONSTRAINT "spl_transfer_spl_id_fkey";

-- DropTable
DROP TABLE "spl_transfer";

-- CreateTable
CREATE TABLE "spl_purchase" (
    "spl_purchase_id" SERIAL NOT NULL,
    "spl_id" INTEGER NOT NULL,
    "sol_paid_per_share" DOUBLE PRECISION NOT NULL,
    "usd_paid_per_share" DOUBLE PRECISION NOT NULL,
    "number_shares_purchased" INTEGER NOT NULL,
    "purchaser_solana_wallet_id" INTEGER NOT NULL,
    "payer_solana_wallet_id" INTEGER NOT NULL,
    "recipient_solana_wallet_id" INTEGER NOT NULL,
    "spl_mint_id" INTEGER NOT NULL,
    "sol_transfer_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "spl_purchase_pkey" PRIMARY KEY ("spl_purchase_id")
);

-- CreateIndex
CREATE INDEX "spl_purchase__spl_id_idx" ON "spl_purchase"("spl_id");

-- CreateIndex
CREATE INDEX "spl_purchase__purchaser_solana_wallet_id_idx" ON "spl_purchase"("purchaser_solana_wallet_id");

-- CreateIndex
CREATE INDEX "spl_purchase__payer_solana_wallet_id_idx" ON "spl_purchase"("payer_solana_wallet_id");

-- CreateIndex
CREATE INDEX "spl_purchase__spl_mint_id_idx" ON "spl_purchase"("spl_mint_id");

-- CreateIndex
CREATE INDEX "spl_purchase__sol_transfer_id_idx" ON "spl_purchase"("sol_transfer_id");

-- CreateIndex
CREATE UNIQUE INDEX "solana_wallet_user_id_key" ON "solana_wallet"("user_id");

-- AddForeignKey
ALTER TABLE "credentials" ADD CONSTRAINT "credentials_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "solana_wallet"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spl_purchase" ADD CONSTRAINT "spl_purchase_spl_id_fkey" FOREIGN KEY ("spl_id") REFERENCES "spl"("spl_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spl_purchase" ADD CONSTRAINT "spl_purchase_purchaser_solana_wallet_id_fkey" FOREIGN KEY ("purchaser_solana_wallet_id") REFERENCES "solana_wallet"("solana_wallet_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spl_purchase" ADD CONSTRAINT "spl_purchase_payer_solana_wallet_id_fkey" FOREIGN KEY ("payer_solana_wallet_id") REFERENCES "solana_wallet"("solana_wallet_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spl_purchase" ADD CONSTRAINT "spl_purchase_recipient_solana_wallet_id_fkey" FOREIGN KEY ("recipient_solana_wallet_id") REFERENCES "solana_wallet"("solana_wallet_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spl_purchase" ADD CONSTRAINT "spl_purchase_spl_mint_id_fkey" FOREIGN KEY ("spl_mint_id") REFERENCES "spl_mint"("splt_mint_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spl_purchase" ADD CONSTRAINT "spl_purchase_sol_transfer_id_fkey" FOREIGN KEY ("sol_transfer_id") REFERENCES "sol_transfer"("sol_transfer_id") ON DELETE RESTRICT ON UPDATE CASCADE;
