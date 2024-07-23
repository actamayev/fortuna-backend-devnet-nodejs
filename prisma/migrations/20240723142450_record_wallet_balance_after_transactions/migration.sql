-- AlterTable
ALTER TABLE "exclusive_video_access_purchase_sol_transfer" ADD COLUMN     "recipient_new_wallet_balance_sol" DOUBLE PRECISION,
ADD COLUMN     "recipient_new_wallet_balance_usd" DOUBLE PRECISION,
ADD COLUMN     "sender_new_wallet_balance_sol" DOUBLE PRECISION,
ADD COLUMN     "sender_new_wallet_balance_usd" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "sol_transfer" ADD COLUMN     "recipient_new_wallet_balance_sol" DOUBLE PRECISION,
ADD COLUMN     "recipient_new_wallet_balance_usd" DOUBLE PRECISION,
ADD COLUMN     "sender_new_wallet_balance_sol" DOUBLE PRECISION,
ADD COLUMN     "sender_new_wallet_balance_usd" DOUBLE PRECISION;
