/*
  Warnings:

  - A unique constraint covering the columns `[email__hashed]` on the table `credentials` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone_number__hashed]` on the table `credentials` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "credentials" ADD COLUMN     "email__encrypted" TEXT,
ADD COLUMN     "email__hashed" TEXT,
ADD COLUMN     "phone_number__encrypted" TEXT,
ADD COLUMN     "phone_number__hashed" TEXT;

-- AlterTable
ALTER TABLE "solana_wallet" ADD COLUMN     "secret_key__encrypted" TEXT;

-- AlterTable
ALTER TABLE "youtube_access_tokens" ADD COLUMN     "refresh_token__encrypted" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "credentials_email__hashed_key" ON "credentials"("email__hashed");

-- CreateIndex
CREATE UNIQUE INDEX "credentials_phone_number__hashed_key" ON "credentials"("phone_number__hashed");
