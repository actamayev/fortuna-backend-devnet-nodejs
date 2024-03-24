/*
  Warnings:

  - The values [MAINNET,DEVNET,TESTNET] on the enum `network_type` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "network_type_new" AS ENUM ('mainnet_beta', 'devnet', 'testnet');
ALTER TABLE "solana_wallet" ALTER COLUMN "network_type" TYPE "network_type_new" USING ("network_type"::text::"network_type_new");
ALTER TYPE "network_type" RENAME TO "network_type_old";
ALTER TYPE "network_type_new" RENAME TO "network_type";
DROP TYPE "network_type_old";
COMMIT;
