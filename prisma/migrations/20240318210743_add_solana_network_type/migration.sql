/*
  Warnings:

  - Added the required column `networkType` to the `SolanaWallet` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "NetworkType" AS ENUM ('MAINNET', 'DEVNET', 'TESTNET');

-- DropIndex
DROP INDEX "SolanaWallet_userId_key";

-- AlterTable
ALTER TABLE "SolanaWallet" ADD COLUMN     "networkType" "NetworkType" NOT NULL;
