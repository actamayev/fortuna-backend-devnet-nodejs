-- AlterTable
ALTER TABLE "blockchain_fees_paid_by_fortuna" ALTER COLUMN "fee_in_sol" DROP NOT NULL,
ALTER COLUMN "fee_in_usd" DROP NOT NULL;
