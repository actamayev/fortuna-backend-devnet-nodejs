-- CreateEnum
CREATE TYPE "SocialPlatforms" AS ENUM ('youtube', 'instagram', 'facebook', 'twitter', 'spotify');

-- CreateTable
CREATE TABLE "social_platform_link" (
    "social_platform_link_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "social_link" TEXT NOT NULL,
    "social_platform" "SocialPlatforms" NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "social_platform_link_pkey" PRIMARY KEY ("social_platform_link_id")
);

-- CreateIndex
CREATE INDEX "social_platform_link__user_id_idx" ON "social_platform_link"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "social_platform_link_user_id_social_platform_key" ON "social_platform_link"("user_id", "social_platform");

-- AddForeignKey
ALTER TABLE "social_platform_link" ADD CONSTRAINT "social_platform_link_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "credentials"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
