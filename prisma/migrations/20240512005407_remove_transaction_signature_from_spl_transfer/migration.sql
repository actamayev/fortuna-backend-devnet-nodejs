/*
  Warnings:

  - You are about to drop the column `transaction_signature` on the `spl_transfer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "spl_transfer" DROP COLUMN "transaction_signature";
