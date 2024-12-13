-- CreateTable
CREATE TABLE "ResetPasswordToken" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "userId" UUID NOT NULL,

    CONSTRAINT "ResetPasswordToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ResetPasswordToken_tokenHash_key" ON "ResetPasswordToken"("tokenHash");

-- CreateIndex
CREATE UNIQUE INDEX "ResetPasswordToken_userId_key" ON "ResetPasswordToken"("userId");

-- CreateIndex
CREATE INDEX "ResetPasswordToken_userId_idx" ON "ResetPasswordToken"("userId");

-- AddForeignKey
ALTER TABLE "ResetPasswordToken" ADD CONSTRAINT "ResetPasswordToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
