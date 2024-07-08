-- AlterTable
ALTER TABLE "channel_banner" ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "channel_name" ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;
