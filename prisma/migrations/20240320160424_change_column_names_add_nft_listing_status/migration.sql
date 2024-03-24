/*
  Warnings:

  - The primary key for the `NFT` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `chainAddress` on the `NFT` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `NFT` table. All the data in the column will be lost.
  - You are about to drop the column `fileName` on the `NFT` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `NFT` table. All the data in the column will be lost.
  - You are about to drop the column `metaDataAddress` on the `NFT` table. All the data in the column will be lost.
  - You are about to drop the column `metaDataUrl` on the `NFT` table. All the data in the column will be lost.
  - You are about to drop the column `nftName` on the `NFT` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `NFT` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `NFT` table. All the data in the column will be lost.
  - You are about to drop the column `walletId` on the `NFT` table. All the data in the column will be lost.
  - The primary key for the `SolanaWallet` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `SolanaWallet` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `SolanaWallet` table. All the data in the column will be lost.
  - You are about to drop the column `networkType` on the `SolanaWallet` table. All the data in the column will be lost.
  - You are about to drop the column `publicKey` on the `SolanaWallet` table. All the data in the column will be lost.
  - You are about to drop the column `secretKey` on the `SolanaWallet` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `SolanaWallet` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `SolanaWallet` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id,network_type]` on the table `SolanaWallet` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "NFTListingStatus" AS ENUM ('PRELISTING', 'LISTED', 'SOLDOUT', 'REMOVED');

-- DropForeignKey
ALTER TABLE "NFT" DROP CONSTRAINT "NFT_userId_fkey";

-- DropForeignKey
ALTER TABLE "NFT" DROP CONSTRAINT "NFT_walletId_fkey";

-- DropForeignKey
ALTER TABLE "SolanaWallet" DROP CONSTRAINT "SolanaWallet_userId_fkey";

-- DropIndex
DROP INDEX "nft_userId_idx";

-- DropIndex
DROP INDEX "nft_walletId_idx";

-- DropIndex
DROP INDEX "SolanaWallet_userId_networkType_key";

-- DropIndex
DROP INDEX "userId_idx";

-- AlterTable
ALTER TABLE "NFT" DROP CONSTRAINT "NFT_pkey",
DROP COLUMN "chainAddress",
DROP COLUMN "createdAt",
DROP COLUMN "fileName",
DROP COLUMN "id",
DROP COLUMN "metaDataAddress",
DROP COLUMN "metaDataUrl",
DROP COLUMN "nftName",
DROP COLUMN "updatedAt",
DROP COLUMN "userId",
DROP COLUMN "walletId",
ADD COLUMN     "chain_address" TEXT,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "file_name" TEXT,
ADD COLUMN     "meta_data_address" TEXT,
ADD COLUMN     "meta_data_url" TEXT,
ADD COLUMN     "nft_id" SERIAL NOT NULL,
ADD COLUMN     "nft_listing_status" "NFTListingStatus",
ADD COLUMN     "nft_name" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "user_id" INTEGER,
ADD COLUMN     "wallet_id" INTEGER,
ADD CONSTRAINT "NFT_pkey" PRIMARY KEY ("nft_id");

-- AlterTable
ALTER TABLE "SolanaWallet" DROP CONSTRAINT "SolanaWallet_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "id",
DROP COLUMN "networkType",
DROP COLUMN "publicKey",
DROP COLUMN "secretKey",
DROP COLUMN "updatedAt",
DROP COLUMN "userId",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "network_type" "NetworkType",
ADD COLUMN     "public_key" VARCHAR(255),
ADD COLUMN     "secret_key" VARCHAR(255),
ADD COLUMN     "solana_wallet_id" SERIAL NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "user_id" INTEGER,
ADD CONSTRAINT "SolanaWallet_pkey" PRIMARY KEY ("solana_wallet_id");

-- CreateIndex
CREATE INDEX "nft_userId_idx" ON "NFT"("user_id");

-- CreateIndex
CREATE INDEX "nft_walletId_idx" ON "NFT"("wallet_id");

-- CreateIndex
CREATE INDEX "userId_idx" ON "SolanaWallet"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "SolanaWallet_user_id_network_type_key" ON "SolanaWallet"("user_id", "network_type");

-- AddForeignKey
ALTER TABLE "SolanaWallet" ADD CONSTRAINT "SolanaWallet_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Credentials"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NFT" ADD CONSTRAINT "NFT_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Credentials"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NFT" ADD CONSTRAINT "NFT_wallet_id_fkey" FOREIGN KEY ("wallet_id") REFERENCES "SolanaWallet"("solana_wallet_id") ON DELETE SET NULL ON UPDATE CASCADE;
