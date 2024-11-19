/*
  Warnings:

  - You are about to drop the column `airaloApiToken` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "airaloApiToken";

-- CreateTable
CREATE TABLE "AiraloToken" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "token" TEXT NOT NULL,
    "expiresIn" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AiraloToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AiraloToken_userId_key" ON "AiraloToken"("userId");

-- CreateIndex
CREATE INDEX "user_Id_airaloToken_Index" ON "AiraloToken"("userId");

-- AddForeignKey
ALTER TABLE "AiraloToken" ADD CONSTRAINT "AiraloToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
