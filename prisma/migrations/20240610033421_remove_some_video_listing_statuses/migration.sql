/*
  Warnings:

  - The values [PRELISTING,REMOVED] on the enum `VideoListingStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "VideoListingStatus_new" AS ENUM ('LISTED', 'SOLDOUT');
ALTER TABLE "video" ALTER COLUMN "video_listing_status" TYPE "VideoListingStatus_new" USING ("video_listing_status"::text::"VideoListingStatus_new");
ALTER TYPE "VideoListingStatus" RENAME TO "VideoListingStatus_old";
ALTER TYPE "VideoListingStatus_new" RENAME TO "VideoListingStatus";
DROP TYPE "VideoListingStatus_old";
COMMIT;
