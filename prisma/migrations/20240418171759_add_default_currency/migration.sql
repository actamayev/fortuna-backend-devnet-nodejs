-- CreateEnum
CREATE TYPE "Currencies" AS ENUM ('usd', 'sol');

-- AlterTable
ALTER TABLE "credentials" ADD COLUMN     "default_currency" "Currencies" NOT NULL DEFAULT 'usd';
