/*
  Warnings:

  - You are about to drop the column `listing_price_per_share_usd` on the `secondary_market_ask` table. All the data in the column will be lost.
  - You are about to drop the column `listing_price_per_share_usd` on the `secondary_market_bid` table. All the data in the column will be lost.
  - Added the required column `ask_price_per_share_usd` to the `secondary_market_ask` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bid_price_per_share_usd` to the `secondary_market_bid` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "secondary_market_ask" DROP COLUMN "listing_price_per_share_usd",
ADD COLUMN     "ask_price_per_share_usd" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "secondary_market_bid" DROP COLUMN "listing_price_per_share_usd",
ADD COLUMN     "bid_price_per_share_usd" DOUBLE PRECISION NOT NULL;
