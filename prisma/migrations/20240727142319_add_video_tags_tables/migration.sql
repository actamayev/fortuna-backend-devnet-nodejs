-- CreateTable
CREATE TABLE "video_tag_lookup" (
    "video_tag_lookup_id" SERIAL NOT NULL,
    "video_tag" TEXT NOT NULL,
    "added_by_user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "video_tag_lookup_pkey" PRIMARY KEY ("video_tag_lookup_id")
);

-- CreateTable
CREATE TABLE "video_tag_mapping" (
    "video_tag_mapping_id" SERIAL NOT NULL,
    "video_tag_lookup_id" INTEGER NOT NULL,
    "video_id" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "video_tag_mapping_pkey" PRIMARY KEY ("video_tag_mapping_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "video_tag_lookup_video_tag_key" ON "video_tag_lookup"("video_tag");

-- CreateIndex
CREATE INDEX "video_tag_lookup__added_by_user_id_idx" ON "video_tag_lookup"("added_by_user_id");

-- CreateIndex
CREATE INDEX "video_tag_mapping__video_tag_lookup_id_idx" ON "video_tag_mapping"("video_tag_lookup_id");

-- CreateIndex
CREATE INDEX "video_tag_mapping__video_id_idx" ON "video_tag_mapping"("video_id");

-- CreateIndex
CREATE UNIQUE INDEX "video_tag_mapping_video_tag_lookup_id_video_id_key" ON "video_tag_mapping"("video_tag_lookup_id", "video_id");

-- AddForeignKey
ALTER TABLE "video_tag_lookup" ADD CONSTRAINT "video_tag_lookup_added_by_user_id_fkey" FOREIGN KEY ("added_by_user_id") REFERENCES "credentials"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "video_tag_mapping" ADD CONSTRAINT "video_tag_mapping_video_tag_lookup_id_fkey" FOREIGN KEY ("video_tag_lookup_id") REFERENCES "video_tag_lookup"("video_tag_lookup_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "video_tag_mapping" ADD CONSTRAINT "video_tag_mapping_video_id_fkey" FOREIGN KEY ("video_id") REFERENCES "video"("video_id") ON DELETE RESTRICT ON UPDATE CASCADE;
