/*
  Warnings:

  - Added the required column `orderInColumn` to the `duties` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "duties" DROP CONSTRAINT "duties_userId_fkey";

-- DropForeignKey
ALTER TABLE "refreshTokens" DROP CONSTRAINT "refreshTokens_userId_fkey";

-- AlterTable
ALTER TABLE "duties" ADD COLUMN     "orderInColumn" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "duties" ADD CONSTRAINT "duties_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refreshTokens" ADD CONSTRAINT "refreshTokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
