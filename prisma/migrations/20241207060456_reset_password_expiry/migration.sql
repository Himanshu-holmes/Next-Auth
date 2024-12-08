/*
  Warnings:

  - Changed the type of `verifyCodeExpiry` on the `ResetPassword` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "ResetPassword" DROP COLUMN "verifyCodeExpiry",
ADD COLUMN     "verifyCodeExpiry" TIMESTAMP(3) NOT NULL;
