/*
  Warnings:

  - You are about to drop the column `default_user_type` on the `credentials` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "credentials" DROP COLUMN "default_user_type";

-- DropEnum
DROP TYPE "default_user_type";
