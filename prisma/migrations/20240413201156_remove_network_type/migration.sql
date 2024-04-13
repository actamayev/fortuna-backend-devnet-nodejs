/*
  Warnings:

  - You are about to drop the column `network_type` on the `solana_wallet` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "solana_wallet_user_id_network_type_key";

-- AlterTable
ALTER TABLE "solana_wallet" DROP COLUMN "network_type";

-- DropEnum
DROP TYPE "network_type";
