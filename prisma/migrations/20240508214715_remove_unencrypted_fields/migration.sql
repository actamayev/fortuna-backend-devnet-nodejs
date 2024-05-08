/*
  Warnings:

  - You are about to drop the column `email` on the `credentials` table. All the data in the column will be lost.
  - You are about to drop the column `phone_number` on the `credentials` table. All the data in the column will be lost.
  - You are about to drop the column `secret_key` on the `solana_wallet` table. All the data in the column will be lost.
  - You are about to drop the column `refresh_token` on the `youtube_access_tokens` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "credentials" DROP COLUMN "email",
DROP COLUMN "phone_number";

-- AlterTable
ALTER TABLE "solana_wallet" DROP COLUMN "secret_key";

-- AlterTable
ALTER TABLE "youtube_access_tokens" DROP COLUMN "refresh_token";
