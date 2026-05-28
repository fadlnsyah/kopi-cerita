-- DropIndex
DROP INDEX "CartItem_cartId_productId_key";

-- AlterTable
ALTER TABLE "CartItem" ADD COLUMN     "modifiersHash" TEXT NOT NULL DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX "CartItem_cartId_productId_modifiersHash_key" ON "CartItem"("cartId", "productId", "modifiersHash");

