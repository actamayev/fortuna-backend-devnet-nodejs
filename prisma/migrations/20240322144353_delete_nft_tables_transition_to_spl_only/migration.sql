/*
  Warnings:

  - You are about to drop the column `nft_id` on the `spl` table. All the data in the column will be lost.
  - You are about to drop the `nft` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `nft_ownership` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `nft_transfer` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `chain_address` to the `spl` table without a default value. This is not possible if the table is not empty.
  - Added the required column `file_name` to the `spl` table without a default value. This is not possible if the table is not empty.
  - Added the required column `listing_price` to the `spl` table without a default value. This is not possible if the table is not empty.
  - Added the required column `meta_data_address` to the `spl` table without a default value. This is not possible if the table is not empty.
  - Added the required column `meta_data_url` to the `spl` table without a default value. This is not possible if the table is not empty.
  - Added the required column `spl_listing_status` to the `spl` table without a default value. This is not possible if the table is not empty.
  - Added the required column `spl_name` to the `spl` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_number_of_shares` to the `spl` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SPLListingStatus" AS ENUM ('PRELISTING', 'LISTED', 'SOLDOUT', 'REMOVED');

-- DropForeignKey
ALTER TABLE "nft" DROP CONSTRAINT "nft_payer_solana_wallet_id_fkey";

-- DropForeignKey
ALTER TABLE "nft" DROP CONSTRAINT "nft_solana_wallet_id_fkey";

-- DropForeignKey
ALTER TABLE "nft_ownership" DROP CONSTRAINT "nft_ownership_nft_id_fkey";

-- DropForeignKey
ALTER TABLE "nft_ownership" DROP CONSTRAINT "nft_ownership_solana_wallet_id_fkey";

-- DropForeignKey
ALTER TABLE "nft_transfer" DROP CONSTRAINT "nft_transfer_from_solana_wallet_id_fkey";

-- DropForeignKey
ALTER TABLE "nft_transfer" DROP CONSTRAINT "nft_transfer_nft_id_fkey";

-- DropForeignKey
ALTER TABLE "nft_transfer" DROP CONSTRAINT "nft_transfer_payer_solana_wallet_id_fkey";

-- DropForeignKey
ALTER TABLE "nft_transfer" DROP CONSTRAINT "nft_transfer_to_solana_wallet_id_fkey";

-- DropForeignKey
ALTER TABLE "spl" DROP CONSTRAINT "spl_nft_id_fkey";

-- DropIndex
DROP INDEX "spl__nft_id_idx";

-- AlterTable
ALTER TABLE "spl" DROP COLUMN "nft_id",
ADD COLUMN     "chain_address" TEXT NOT NULL,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "file_name" TEXT NOT NULL,
ADD COLUMN     "listing_price" INTEGER NOT NULL,
ADD COLUMN     "meta_data_address" TEXT NOT NULL,
ADD COLUMN     "meta_data_url" TEXT NOT NULL,
ADD COLUMN     "spl_listing_status" "SPLListingStatus" NOT NULL,
ADD COLUMN     "spl_name" TEXT NOT NULL,
ADD COLUMN     "total_number_of_shares" INTEGER NOT NULL;

-- DropTable
DROP TABLE "nft";

-- DropTable
DROP TABLE "nft_ownership";

-- DropTable
DROP TABLE "nft_transfer";

-- DropEnum
DROP TYPE "NFTListingStatus";
