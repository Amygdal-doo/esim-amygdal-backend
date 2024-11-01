/*
  Warnings:

  - A unique constraint covering the columns `[microsoftId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "microsoftId" VARCHAR(100);

-- CreateIndex
CREATE UNIQUE INDEX "user_microsoft_unique" ON "User"("microsoftId");
