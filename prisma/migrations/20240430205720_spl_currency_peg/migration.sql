/*
  Warnings:

  - You are about to drop the column `listing_price_per_share_sol` on the `spl` table. All the data in the column will be lost.
  - You are about to drop the column `listing_price_per_share_usd` on the `spl` table. All the data in the column will be lost.
  - Added the required column `transfer_currency` to the `sol_transfer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `listing_currency` to the `spl` table without a default value. This is not possible if the table is not empty.
  - Added the required column `listing_price_per_share` to the `spl` table without a default value. This is not possible if the table is not empty.
  - Added the required column `is_secondary_market_transaction` to the `spl_transfer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "sol_transfer" ADD COLUMN     "transfer_currency" "Currencies" NOT NULL;

-- AlterTable
ALTER TABLE "spl" DROP COLUMN "listing_price_per_share_sol",
DROP COLUMN "listing_price_per_share_usd",
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "listing_currency" "Currencies" NOT NULL,
ADD COLUMN     "listing_price_per_share" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "original_content_url" DROP DEFAULT;

-- AlterTable
ALTER TABLE "spl_transfer" ADD COLUMN     "is_secondary_market_transaction" BOOLEAN NOT NULL;
