/*
  Warnings:

  - Added the required column `value_of_remaining_bid_usd` to the `secondary_market_bid` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "secondary_market_bid" ADD COLUMN     "value_of_remaining_bid_usd" DOUBLE PRECISION NOT NULL;
