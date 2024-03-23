/*
  Warnings:

  - You are about to drop the column `blockchain_mint_fee` on the `spl` table. All the data in the column will be lost.
  - You are about to drop the column `blockchain_mint_fee` on the `spl_mint` table. All the data in the column will be lost.
  - You are about to drop the column `blockchain_mint_fee` on the `spl_transfer` table. All the data in the column will be lost.
  - Added the required column `spl_mint_fee_dollars` to the `spl_mint` table without a default value. This is not possible if the table is not empty.
  - Added the required column `spl_mint_fee_sol` to the `spl_mint` table without a default value. This is not possible if the table is not empty.
  - Added the required column `spl_mint_fee_dollars` to the `spl_transfer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `spl_mint_fee_sol` to the `spl_transfer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "spl" DROP COLUMN "blockchain_mint_fee";

-- AlterTable
ALTER TABLE "spl_mint" DROP COLUMN "blockchain_mint_fee",
ADD COLUMN     "spl_mint_fee_dollars" INTEGER NOT NULL,
ADD COLUMN     "spl_mint_fee_sol" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "spl_transfer" DROP COLUMN "blockchain_mint_fee",
ADD COLUMN     "spl_mint_fee_dollars" INTEGER NOT NULL,
ADD COLUMN     "spl_mint_fee_sol" INTEGER NOT NULL;
