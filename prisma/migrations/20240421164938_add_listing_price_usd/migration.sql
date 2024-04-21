/*
  Warnings:

  - Added the required column `listing_price_per_share_usd` to the `spl` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "spl" ADD COLUMN     "listing_price_per_share_usd" DOUBLE PRECISION NOT NULL;
