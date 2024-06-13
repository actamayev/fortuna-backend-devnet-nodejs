-- CreateTable
CREATE TABLE "video_like_status" (
    "video_like_status_id" SERIAL NOT NULL,
    "like_status" BOOLEAN NOT NULL,
    "video_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "video_like_status_pkey" PRIMARY KEY ("video_like_status_id")
);

-- CreateIndex
CREATE INDEX "video_like_status__video_id_idx" ON "video_like_status"("video_id");

-- CreateIndex
CREATE INDEX "video_like_status__user_id_idx" ON "video_like_status"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "video_like_status_video_id_user_id_key" ON "video_like_status"("video_id", "user_id");

-- AddForeignKey
ALTER TABLE "video_like_status" ADD CONSTRAINT "video_like_status_video_id_fkey" FOREIGN KEY ("video_id") REFERENCES "video"("video_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "video_like_status" ADD CONSTRAINT "video_like_status_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "credentials"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
