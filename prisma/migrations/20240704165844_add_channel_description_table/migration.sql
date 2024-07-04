-- CreateTable
CREATE TABLE "channel_description" (
    "channel_description_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "channel_description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "channel_description_pkey" PRIMARY KEY ("channel_description_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "channel_description_user_id_key" ON "channel_description"("user_id");

-- CreateIndex
CREATE INDEX "channel_description__user_id_idx" ON "channel_description"("user_id");

-- AddForeignKey
ALTER TABLE "channel_description" ADD CONSTRAINT "channel_description_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "credentials"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
