-- CreateEnum
CREATE TYPE "LoginType" AS ENUM ('GOOGLE', 'APPLE', 'CREDENTIALS');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'SUPER_ADMIN');

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "firstName" VARCHAR(256) NOT NULL,
    "lastName" VARCHAR(256) NOT NULL,
    "username" VARCHAR(256) NOT NULL,
    "email" VARCHAR(256) NOT NULL,
    "role" "Role" NOT NULL,
    "loginType" "LoginType" NOT NULL,
    "googleId" VARCHAR(100),
    "appleId" VARCHAR(100),
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_userId_key" ON "RefreshToken"("userId");

-- CreateIndex
CREATE INDEX "user_Id_Index" ON "RefreshToken"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_username_unique" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_unique" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_googleId_unique" ON "User"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "user_appleId_unique" ON "User"("appleId");

-- CreateIndex
CREATE INDEX "email_Index" ON "User"("email");

-- CreateIndex
CREATE INDEX "id_Index" ON "User"("id");

-- CreateIndex
CREATE INDEX "username_Index" ON "User"("username");

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
