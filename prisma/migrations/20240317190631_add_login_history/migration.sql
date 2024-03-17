-- CreateTable
CREATE TABLE "Credentials" (
    "user_id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "email" TEXT,
    "phone_number" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Credentials_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "LoginHistory" (
    "login_history_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "login_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LoginHistory_pkey" PRIMARY KEY ("login_history_id")
);

-- CreateIndex
CREATE INDEX "user_id_idx" ON "LoginHistory"("user_id");

-- AddForeignKey
ALTER TABLE "LoginHistory" ADD CONSTRAINT "LoginHistory_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Credentials"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
