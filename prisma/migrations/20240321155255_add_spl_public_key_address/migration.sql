/*
  Warnings:

  - Added the required column `public_key_address` to the `SPL` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SPL" ADD COLUMN     "public_key_address" TEXT NOT NULL;
