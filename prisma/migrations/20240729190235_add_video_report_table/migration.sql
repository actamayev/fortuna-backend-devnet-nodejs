-- CreateTable
CREATE TABLE "reported_video" (
    "reported_video_id" SERIAL NOT NULL,
    "video_id" INTEGER NOT NULL,
    "user_id_who_reported_video" INTEGER NOT NULL,
    "report_message" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reported_video_pkey" PRIMARY KEY ("reported_video_id")
);

-- CreateIndex
CREATE INDEX "reported_video__video_id_idx" ON "reported_video"("video_id");

-- CreateIndex
CREATE INDEX "reported_video__user_id_who_reported_video_idx" ON "reported_video"("user_id_who_reported_video");

-- CreateIndex
CREATE UNIQUE INDEX "reported_video_video_id_user_id_who_reported_video_key" ON "reported_video"("video_id", "user_id_who_reported_video");

-- AddForeignKey
ALTER TABLE "reported_video" ADD CONSTRAINT "reported_video_video_id_fkey" FOREIGN KEY ("video_id") REFERENCES "video"("video_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reported_video" ADD CONSTRAINT "reported_video_user_id_who_reported_video_fkey" FOREIGN KEY ("user_id_who_reported_video") REFERENCES "credentials"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
