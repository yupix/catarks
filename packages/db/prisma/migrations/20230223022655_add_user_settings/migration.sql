-- AlterTable
ALTER TABLE "UserSettings" ADD COLUMN     "defaultUseTax" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "useTheme" TEXT NOT NULL DEFAULT 'winter';
