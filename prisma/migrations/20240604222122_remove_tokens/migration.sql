/*
  Warnings:

  - You are about to drop the column `is_approved_to_be_creator` on the `credentials` table. All the data in the column will be lost.
  - You are about to drop the column `is_spl_purchase` on the `sol_transfer` table. All the data in the column will be lost.
  - You are about to drop the column `uuid` on the `uploaded_image` table. All the data in the column will be lost.
  - You are about to drop the column `uuid` on the `uploaded_video` table. All the data in the column will be lost.
  - You are about to drop the `exclusive_spl_purchase` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `spl` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `spl_mint` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `spl_ownership` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `spl_purchase` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `spl_transfer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `token_account` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `is_exclusive_video_access_purchase` to the `sol_transfer` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "VideoListingStatus" AS ENUM ('PRELISTING', 'LISTED', 'SOLDOUT', 'REMOVED');

-- DropForeignKey
ALTER TABLE "exclusive_spl_purchase" DROP CONSTRAINT "exclusive_spl_purchase_sol_transfer_id_fkey";

-- DropForeignKey
ALTER TABLE "exclusive_spl_purchase" DROP CONSTRAINT "exclusive_spl_purchase_solana_wallet_id_fkey";

-- DropForeignKey
ALTER TABLE "exclusive_spl_purchase" DROP CONSTRAINT "exclusive_spl_purchase_spl_id_fkey";

-- DropForeignKey
ALTER TABLE "spl" DROP CONSTRAINT "spl_create_spl_fee_payer_solana_wallet_id_fkey";

-- DropForeignKey
ALTER TABLE "spl" DROP CONSTRAINT "spl_create_spl_metadata_fee_payer_solana_wallet_id_fkey";

-- DropForeignKey
ALTER TABLE "spl" DROP CONSTRAINT "spl_creator_wallet_id_fkey";

-- DropForeignKey
ALTER TABLE "spl" DROP CONSTRAINT "spl_uploaded_image_id_fkey";

-- DropForeignKey
ALTER TABLE "spl" DROP CONSTRAINT "spl_uploaded_video_id_fkey";

-- DropForeignKey
ALTER TABLE "spl_mint" DROP CONSTRAINT "spl_mint_fee_payer_solana_wallet_id_fkey";

-- DropForeignKey
ALTER TABLE "spl_mint" DROP CONSTRAINT "spl_mint_spl_id_fkey";

-- DropForeignKey
ALTER TABLE "spl_mint" DROP CONSTRAINT "spl_mint_token_account_id_fkey";

-- DropForeignKey
ALTER TABLE "spl_ownership" DROP CONSTRAINT "spl_ownership_solana_wallet_id_fkey";

-- DropForeignKey
ALTER TABLE "spl_ownership" DROP CONSTRAINT "spl_ownership_spl_id_fkey";

-- DropForeignKey
ALTER TABLE "spl_purchase" DROP CONSTRAINT "spl_purchase_sol_transfer_id_fkey";

-- DropForeignKey
ALTER TABLE "spl_purchase" DROP CONSTRAINT "spl_purchase_spl_id_fkey";

-- DropForeignKey
ALTER TABLE "spl_purchase" DROP CONSTRAINT "spl_purchase_spl_transfer_id_fkey";

-- DropForeignKey
ALTER TABLE "spl_transfer" DROP CONSTRAINT "spl_transfer_recipient_solana_wallet_id_fkey";

-- DropForeignKey
ALTER TABLE "spl_transfer" DROP CONSTRAINT "spl_transfer_sender_solana_wallet_id_fkey";

-- DropForeignKey
ALTER TABLE "spl_transfer" DROP CONSTRAINT "spl_transfer_spl_id_fkey";

-- DropForeignKey
ALTER TABLE "token_account" DROP CONSTRAINT "token_account_fee_payer_solana_wallet_id_fkey";

-- DropForeignKey
ALTER TABLE "token_account" DROP CONSTRAINT "token_account_parent_solana_wallet_id_fkey";

-- DropForeignKey
ALTER TABLE "token_account" DROP CONSTRAINT "token_account_spl_id_fkey";

-- AlterTable
ALTER TABLE "credentials" DROP COLUMN "is_approved_to_be_creator";

-- AlterTable
ALTER TABLE "sol_transfer" DROP COLUMN "is_spl_purchase",
ADD COLUMN     "is_exclusive_video_access_purchase" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "uploaded_image" DROP COLUMN "uuid";

-- AlterTable
ALTER TABLE "uploaded_video" DROP COLUMN "uuid";

-- DropTable
DROP TABLE "exclusive_spl_purchase";

-- DropTable
DROP TABLE "spl";

-- DropTable
DROP TABLE "spl_mint";

-- DropTable
DROP TABLE "spl_ownership";

-- DropTable
DROP TABLE "spl_purchase";

-- DropTable
DROP TABLE "spl_transfer";

-- DropTable
DROP TABLE "token_account";

-- DropEnum
DROP TYPE "SPLListingStatus";

-- CreateTable
CREATE TABLE "video" (
    "video_id" SERIAL NOT NULL,
    "video_name" TEXT NOT NULL,
    "listing_price_to_access_usd" DOUBLE PRECISION NOT NULL,
    "creator_wallet_id" INTEGER NOT NULL,
    "uploaded_image_id" INTEGER NOT NULL,
    "uploaded_video_id" INTEGER NOT NULL,
    "original_content_url" TEXT NOT NULL,
    "uuid" TEXT NOT NULL,
    "is_video_exclusive" BOOLEAN NOT NULL,
    "video_listing_status" "VideoListingStatus" NOT NULL,
    "description" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "video_pkey" PRIMARY KEY ("video_id")
);

-- CreateTable
CREATE TABLE "video_access_tier" (
    "video_access_tier_id" SERIAL NOT NULL,
    "video_id" INTEGER NOT NULL,
    "tier_number" INTEGER NOT NULL,
    "purchases_allowed_for_this_tier" INTEGER NOT NULL,
    "percent_discount_at_this_tier" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "video_access_tier_pkey" PRIMARY KEY ("video_access_tier_id")
);

-- CreateTable
CREATE TABLE "exclusive_video_access_purchase" (
    "exclusive_video_access_purchase_id" SERIAL NOT NULL,
    "video_id" INTEGER NOT NULL,
    "solana_wallet_id" INTEGER NOT NULL,
    "sol_transfer_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "exclusive_video_access_purchase_pkey" PRIMARY KEY ("exclusive_video_access_purchase_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "video_uploaded_image_id_key" ON "video"("uploaded_image_id");

-- CreateIndex
CREATE UNIQUE INDEX "video_uploaded_video_id_key" ON "video"("uploaded_video_id");

-- CreateIndex
CREATE INDEX "video__creator_wallet_id_idx" ON "video"("creator_wallet_id");

-- CreateIndex
CREATE INDEX "video__uploaded_image_id_idx" ON "video"("uploaded_image_id");

-- CreateIndex
CREATE INDEX "video_access_tiers__video_id_idx" ON "video_access_tier"("video_id");

-- CreateIndex
CREATE UNIQUE INDEX "video_access_tier_video_id_tier_number_key" ON "video_access_tier"("video_id", "tier_number");

-- CreateIndex
CREATE UNIQUE INDEX "exclusive_video_access_purchase_sol_transfer_id_key" ON "exclusive_video_access_purchase"("sol_transfer_id");

-- CreateIndex
CREATE INDEX "exclusive_video_access_purchase__video_id_idx" ON "exclusive_video_access_purchase"("video_id");

-- CreateIndex
CREATE INDEX "exclusive_video_access_purchase__solana_wallet_id_idx" ON "exclusive_video_access_purchase"("solana_wallet_id");

-- CreateIndex
CREATE INDEX "exclusive_video_access_purchase__sol_transfer_id_idx" ON "exclusive_video_access_purchase"("sol_transfer_id");

-- CreateIndex
CREATE UNIQUE INDEX "exclusive_video_access_purchase_video_id_solana_wallet_id_key" ON "exclusive_video_access_purchase"("video_id", "solana_wallet_id");

-- AddForeignKey
ALTER TABLE "video" ADD CONSTRAINT "video_creator_wallet_id_fkey" FOREIGN KEY ("creator_wallet_id") REFERENCES "solana_wallet"("solana_wallet_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "video" ADD CONSTRAINT "video_uploaded_image_id_fkey" FOREIGN KEY ("uploaded_image_id") REFERENCES "uploaded_image"("uploaded_image_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "video" ADD CONSTRAINT "video_uploaded_video_id_fkey" FOREIGN KEY ("uploaded_video_id") REFERENCES "uploaded_video"("uploaded_video_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "video_access_tier" ADD CONSTRAINT "video_access_tier_video_id_fkey" FOREIGN KEY ("video_id") REFERENCES "video"("video_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exclusive_video_access_purchase" ADD CONSTRAINT "exclusive_video_access_purchase_video_id_fkey" FOREIGN KEY ("video_id") REFERENCES "video"("video_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exclusive_video_access_purchase" ADD CONSTRAINT "exclusive_video_access_purchase_solana_wallet_id_fkey" FOREIGN KEY ("solana_wallet_id") REFERENCES "solana_wallet"("solana_wallet_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exclusive_video_access_purchase" ADD CONSTRAINT "exclusive_video_access_purchase_sol_transfer_id_fkey" FOREIGN KEY ("sol_transfer_id") REFERENCES "sol_transfer"("sol_transfer_id") ON DELETE RESTRICT ON UPDATE CASCADE;
