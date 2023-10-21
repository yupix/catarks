-- CreateTable
CREATE TABLE "ItemPriceAverage" (
    "id" TEXT NOT NULL,
    "ship" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "itemId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ItemPriceAverage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ItemPriceAverage" ADD CONSTRAINT "ItemPriceAverage_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
