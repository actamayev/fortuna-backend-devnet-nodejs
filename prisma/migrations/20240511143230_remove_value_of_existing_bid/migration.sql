/*
  Warnings:

  - You are about to drop the column `value_of_remaining_bid_usd` on the `secondary_market_bid` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "secondary_market_bid" DROP COLUMN "value_of_remaining_bid_usd";
