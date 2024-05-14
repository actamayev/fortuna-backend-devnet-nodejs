/*
  Warnings:

  - Added the required column `purchase_price_per_share_usd` to the `spl_ownership` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "spl_ownership" ADD COLUMN     "purchase_price_per_share_usd" DOUBLE PRECISION NOT NULL;
