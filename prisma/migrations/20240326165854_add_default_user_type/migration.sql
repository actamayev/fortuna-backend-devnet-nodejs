/*
  Warnings:

  - Added the required column `default_user_type` to the `credentials` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "default_user_type" AS ENUM ('creator', 'supporter');

-- AlterTable
ALTER TABLE "credentials" ADD COLUMN     "default_user_type" "default_user_type" NOT NULL;
