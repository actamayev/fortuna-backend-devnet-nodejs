-- CreateEnum
CREATE TYPE "SiteThemes" AS ENUM ('light', 'dark');

-- AlterTable
ALTER TABLE "credentials" ADD COLUMN     "default_site_theme" "SiteThemes" NOT NULL DEFAULT 'light';
