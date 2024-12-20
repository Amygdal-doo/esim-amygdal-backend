/*
  Warnings:

  - You are about to drop the column `packageId` on the `MonriOrder` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `MonriOrder` table. All the data in the column will be lost.
  - You are about to drop the column `currencyId` on the `Wallet` table. All the data in the column will be lost.
  - You are about to drop the `Transaction` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "WalletTransactionType" AS ENUM ('CREDIT_PURCHASE', 'ORDER_DEDUCTION', 'REFUND', 'MANUAL_ADJUSTMENT');

-- CreateEnum
CREATE TYPE "MonriCurrency" AS ENUM ('USD', 'EUR', 'BAM', 'HRK');

-- DropForeignKey
ALTER TABLE "AiraloOrder" DROP CONSTRAINT "AiraloOrder_transactionId_fkey";

-- DropForeignKey
ALTER TABLE "MonriOrder" DROP CONSTRAINT "MonriOrder_transactionId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_userId_fkey";

-- DropForeignKey
ALTER TABLE "Wallet" DROP CONSTRAINT "Wallet_currencyId_fkey";

-- AlterTable
ALTER TABLE "MonriOrder" DROP COLUMN "packageId",
DROP COLUMN "quantity";

-- AlterTable
ALTER TABLE "Wallet" DROP COLUMN "currencyId";

-- DropTable
DROP TABLE "Transaction";

-- CreateTable
CREATE TABLE "WalletTransaction" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "amount" MONEY NOT NULL,
    "description" TEXT,
    "type" "WalletTransactionType" NOT NULL,
    "userId" UUID NOT NULL,
    "status" "OrderStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WalletTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreditBundle" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "price" MONEY NOT NULL,
    "currency" "MonriCurrency" NOT NULL,
    "credits" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CreditBundle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WalletTransaction_userId_idx" ON "WalletTransaction"("userId");

-- CreateIndex
CREATE INDEX "CreditBundle_id_isActive_idx" ON "CreditBundle"("id", "isActive");

-- CreateIndex
CREATE INDEX "CreditBundle_title_idx" ON "CreditBundle"("title");

-- AddForeignKey
ALTER TABLE "AiraloOrder" ADD CONSTRAINT "AiraloOrder_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "WalletTransaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonriOrder" ADD CONSTRAINT "MonriOrder_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "WalletTransaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletTransaction" ADD CONSTRAINT "WalletTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
