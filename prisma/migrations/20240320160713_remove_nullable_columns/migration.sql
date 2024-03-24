/*
  Warnings:

  - Made the column `chain_address` on table `NFT` required. This step will fail if there are existing NULL values in that column.
  - Made the column `file_name` on table `NFT` required. This step will fail if there are existing NULL values in that column.
  - Made the column `meta_data_address` on table `NFT` required. This step will fail if there are existing NULL values in that column.
  - Made the column `meta_data_url` on table `NFT` required. This step will fail if there are existing NULL values in that column.
  - Made the column `nft_listing_status` on table `NFT` required. This step will fail if there are existing NULL values in that column.
  - Made the column `nft_name` on table `NFT` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user_id` on table `NFT` required. This step will fail if there are existing NULL values in that column.
  - Made the column `wallet_id` on table `NFT` required. This step will fail if there are existing NULL values in that column.
  - Made the column `network_type` on table `SolanaWallet` required. This step will fail if there are existing NULL values in that column.
  - Made the column `public_key` on table `SolanaWallet` required. This step will fail if there are existing NULL values in that column.
  - Made the column `secret_key` on table `SolanaWallet` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user_id` on table `SolanaWallet` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "NFT" DROP CONSTRAINT "NFT_user_id_fkey";

-- DropForeignKey
ALTER TABLE "NFT" DROP CONSTRAINT "NFT_wallet_id_fkey";

-- DropForeignKey
ALTER TABLE "SolanaWallet" DROP CONSTRAINT "SolanaWallet_user_id_fkey";

-- AlterTable
ALTER TABLE "NFT" ALTER COLUMN "chain_address" SET NOT NULL,
ALTER COLUMN "file_name" SET NOT NULL,
ALTER COLUMN "meta_data_address" SET NOT NULL,
ALTER COLUMN "meta_data_url" SET NOT NULL,
ALTER COLUMN "nft_listing_status" SET NOT NULL,
ALTER COLUMN "nft_name" SET NOT NULL,
ALTER COLUMN "user_id" SET NOT NULL,
ALTER COLUMN "wallet_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "SolanaWallet" ALTER COLUMN "network_type" SET NOT NULL,
ALTER COLUMN "public_key" SET NOT NULL,
ALTER COLUMN "secret_key" SET NOT NULL,
ALTER COLUMN "user_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "SolanaWallet" ADD CONSTRAINT "SolanaWallet_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Credentials"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NFT" ADD CONSTRAINT "NFT_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Credentials"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NFT" ADD CONSTRAINT "NFT_wallet_id_fkey" FOREIGN KEY ("wallet_id") REFERENCES "SolanaWallet"("solana_wallet_id") ON DELETE RESTRICT ON UPDATE CASCADE;
