-- AlterTable
ALTER TABLE "User" ALTER COLUMN "password" DROP NOT NULL,
ALTER COLUMN "verifyCode" DROP NOT NULL,
ALTER COLUMN "verifyCodeExpiry" DROP NOT NULL,
ALTER COLUMN "username" DROP NOT NULL;
