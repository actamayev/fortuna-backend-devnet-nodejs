/*
  Warnings:

  - Added the required column `transaction_signature` to the `spl_transfer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "spl_transfer" ADD COLUMN     "transaction_signature" TEXT NOT NULL;
