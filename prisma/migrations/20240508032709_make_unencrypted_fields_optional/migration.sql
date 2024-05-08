/*
  Warnings:

  - Made the column `secret_key__encrypted` on table `solana_wallet` required. This step will fail if there are existing NULL values in that column.
  - Made the column `refresh_token__encrypted` on table `youtube_access_tokens` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "solana_wallet" ALTER COLUMN "secret_key" DROP NOT NULL,
ALTER COLUMN "secret_key__encrypted" SET NOT NULL;

-- AlterTable
ALTER TABLE "youtube_access_tokens" ALTER COLUMN "refresh_token" DROP NOT NULL,
ALTER COLUMN "refresh_token__encrypted" SET NOT NULL;
