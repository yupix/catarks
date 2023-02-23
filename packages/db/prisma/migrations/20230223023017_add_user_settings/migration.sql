/*
  Warnings:

  - The `useTheme` column on the `UserSettings` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Themes" AS ENUM ('light', 'winter');

-- AlterTable
ALTER TABLE "UserSettings" DROP COLUMN "useTheme",
ADD COLUMN     "useTheme" "Themes" NOT NULL DEFAULT 'winter';
