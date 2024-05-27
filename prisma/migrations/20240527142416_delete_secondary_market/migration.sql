/*
  Warnings:

  - You are about to drop the column `is_secondary_market_transaction` on the `spl_transfer` table. All the data in the column will be lost.
  - You are about to drop the column `secondary_market_transaction_id` on the `spl_transfer` table. All the data in the column will be lost.
  - You are about to drop the `secondary_market_ask` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `secondary_market_bid` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `secondary_market_transaction` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "secondary_market_ask" DROP CONSTRAINT "secondary_market_ask_solana_wallet_id_fkey";

-- DropForeignKey
ALTER TABLE "secondary_market_ask" DROP CONSTRAINT "secondary_market_ask_spl_id_fkey";

-- DropForeignKey
ALTER TABLE "secondary_market_bid" DROP CONSTRAINT "secondary_market_bid_solana_wallet_id_fkey";

-- DropForeignKey
ALTER TABLE "secondary_market_bid" DROP CONSTRAINT "secondary_market_bid_spl_id_fkey";

-- DropForeignKey
ALTER TABLE "secondary_market_transaction" DROP CONSTRAINT "secondary_market_transaction_secondary_market_ask_id_fkey";

-- DropForeignKey
ALTER TABLE "secondary_market_transaction" DROP CONSTRAINT "secondary_market_transaction_secondary_market_bid_id_fkey";

-- DropForeignKey
ALTER TABLE "secondary_market_transaction" DROP CONSTRAINT "secondary_market_transaction_sol_transfer_id_fkey";

-- DropForeignKey
ALTER TABLE "spl_transfer" DROP CONSTRAINT "spl_transfer_secondary_market_transaction_id_fkey";

-- AlterTable
ALTER TABLE "spl_transfer" DROP COLUMN "is_secondary_market_transaction",
DROP COLUMN "secondary_market_transaction_id";

-- DropTable
DROP TABLE "secondary_market_ask";

-- DropTable
DROP TABLE "secondary_market_bid";

-- DropTable
DROP TABLE "secondary_market_transaction";
