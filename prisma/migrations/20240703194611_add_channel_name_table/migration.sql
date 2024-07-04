-- CreateTable
CREATE TABLE "channel_name" (
    "channel_name_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "channel_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "channel_name_pkey" PRIMARY KEY ("channel_name_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "channel_name_user_id_key" ON "channel_name"("user_id");

-- CreateIndex
CREATE INDEX "channel_name__user_id_idx" ON "channel_name"("user_id");

-- AddForeignKey
ALTER TABLE "channel_name" ADD CONSTRAINT "channel_name_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "credentials"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
