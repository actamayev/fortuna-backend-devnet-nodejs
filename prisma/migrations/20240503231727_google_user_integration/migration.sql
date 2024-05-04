-- CreateEnum
CREATE TYPE "AuthMethods" AS ENUM ('fortuna', 'google');

-- AlterTable
ALTER TABLE "credentials" ADD COLUMN     "auth_method" "AuthMethods" NOT NULL DEFAULT 'fortuna',
ALTER COLUMN "username" DROP NOT NULL,
ALTER COLUMN "password" DROP NOT NULL;
