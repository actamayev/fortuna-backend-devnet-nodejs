/*
  Warnings:

  - You are about to drop the column `transfer_currency` on the `sol_transfer` table. All the data in the column will be lost.
  - You are about to drop the column `listing_currency` on the `spl` table. All the data in the column will be lost.
  - Added the required column `transfer_by_currency` to the `sol_transfer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `listing_currency_peg` to the `spl` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "sol_transfer" DROP COLUMN "transfer_currency",
ADD COLUMN     "transfer_by_currency" "Currencies" NOT NULL;

-- AlterTable
ALTER TABLE "spl" DROP COLUMN "listing_currency",
ADD COLUMN     "listing_currency_peg" "Currencies" NOT NULL;
