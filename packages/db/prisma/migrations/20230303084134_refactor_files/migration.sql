/*
  Warnings:

  - You are about to drop the column `filesHash` on the `Diaries` table. All the data in the column will be lost.
  - The primary key for the `Files` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `UUIDFilename` on the `Files` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[hash]` on the table `Files` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fileId` to the `Diaries` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `Files` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "Diaries" DROP CONSTRAINT "Diaries_filesHash_fkey";

-- DropIndex
DROP INDEX "Files_UUIDFilename_key";

-- AlterTable
ALTER TABLE "Files" ADD COLUMN id text;

-- UpdateTable
UPDATE "Files"
SET id = query1."UUIDFilename"
FROM (SELECT "UUIDFilename" FROM "Files") as query1;

-- AlterTable
ALTER TABLE "Files" DROP CONSTRAINT "Files_pkey",
  DROP COLUMN "UUIDFilename",
  ALTER COLUMN "id" SET NOT NULL,
  ADD CONSTRAINT "Files_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Diaries"
    ADD COLUMN "fileId" text;

-- UpdateTable
UPDATE "Diaries"
  SET "fileId" = query1."id"
  FROM (SELECT "id", "hash" FROM "Files") as query1
  WHERE "Diaries"."filesHash" = query1.hash;

-- AlterTable
ALTER TABLE "Diaries"
    DROP COLUMN "filesHash",
    ALTER COLUMN "fileId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Files_hash_key" ON "Files"("hash");

-- AddForeignKey
ALTER TABLE "Diaries" ADD CONSTRAINT "Diaries_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "Files"("id") ON DELETE RESTRICT ON UPDATE CASCADE;