/*
  Warnings:

  - A unique constraint covering the columns `[fuzzyName]` on the table `Item` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fuzzyName` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "fuzzyName" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Item_fuzzyName_key" ON "Item"("fuzzyName");
