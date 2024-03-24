-- DropForeignKey
ALTER TABLE "spl" DROP CONSTRAINT "spl_create_spl_metadata_payer_solana_wallet_id_fkey";

-- AlterTable
ALTER TABLE "spl" ALTER COLUMN "create_spl_metadata_payer_solana_wallet_id" DROP NOT NULL,
ALTER COLUMN "spl_metadata_creation_fee_sol" DROP NOT NULL,
ALTER COLUMN "spl_metadata_creation_fee_usd" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "spl" ADD CONSTRAINT "spl_create_spl_metadata_payer_solana_wallet_id_fkey" FOREIGN KEY ("create_spl_metadata_payer_solana_wallet_id") REFERENCES "solana_wallet"("solana_wallet_id") ON DELETE SET NULL ON UPDATE CASCADE;
