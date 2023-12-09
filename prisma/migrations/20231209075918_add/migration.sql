/*
  Warnings:

  - A unique constraint covering the columns `[itemId]` on the table `Ability` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `itemId` to the `Ability` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_abilityName_fkey";

-- AlterTable
ALTER TABLE "Ability" ADD COLUMN     "itemId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "isSelling" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE UNIQUE INDEX "Ability_itemId_key" ON "Ability"("itemId");

-- AddForeignKey
ALTER TABLE "Ability" ADD CONSTRAINT "Ability_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
