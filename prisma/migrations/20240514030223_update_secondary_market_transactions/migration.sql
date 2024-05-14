/*
  Warnings:

  - You are about to drop the column `spl_transfer_id` on the `secondary_market_transaction` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "secondary_market_transaction" DROP CONSTRAINT "secondary_market_transaction_spl_transfer_id_fkey";

-- DropIndex
DROP INDEX "secondary_market_purchase__spl_transfer_id_idx";

-- AlterTable
ALTER TABLE "secondary_market_transaction" DROP COLUMN "spl_transfer_id";

-- AlterTable
ALTER TABLE "spl_transfer" ADD COLUMN     "secondary_market_transaction_id" INTEGER;

-- AddForeignKey
ALTER TABLE "spl_transfer" ADD CONSTRAINT "spl_transfer_secondary_market_transaction_id_fkey" FOREIGN KEY ("secondary_market_transaction_id") REFERENCES "secondary_market_transaction"("secondary_market_transaction_id") ON DELETE SET NULL ON UPDATE CASCADE;
