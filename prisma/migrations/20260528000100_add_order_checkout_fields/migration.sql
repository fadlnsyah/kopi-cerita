-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "subtotal" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "serviceFee" INTEGER NOT NULL DEFAULT 2000,
ADD COLUMN     "discountAmount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "couponCode" TEXT,
ADD COLUMN     "contactPhone" TEXT,
ADD COLUMN     "contactEmail" TEXT,
ADD COLUMN     "orderType" TEXT NOT NULL DEFAULT 'dine-in';

