/*
  Warnings:

  - You are about to drop the column `email__hashed` on the `credentials` table. All the data in the column will be lost.
  - You are about to drop the column `phone_number__hashed` on the `credentials` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "credentials_email__hashed_key";

-- DropIndex
DROP INDEX "credentials_phone_number__hashed_key";

-- AlterTable
ALTER TABLE "credentials" DROP COLUMN "email__hashed",
DROP COLUMN "phone_number__hashed";
