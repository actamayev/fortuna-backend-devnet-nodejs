/*
  Warnings:

  - You are about to drop the column `is_recipient_fortuna_user` on the `sol_transfer` table. All the data in the column will be lost.
  - Added the required column `is_recipient_fortuna_wallet` to the `sol_transfer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "sol_transfer" DROP COLUMN "is_recipient_fortuna_user",
ADD COLUMN     "is_recipient_fortuna_wallet" BOOLEAN NOT NULL;
