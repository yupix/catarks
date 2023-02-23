-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Themes" ADD VALUE 'dark';
ALTER TYPE "Themes" ADD VALUE 'cupcake';
ALTER TYPE "Themes" ADD VALUE 'bumblebee';
ALTER TYPE "Themes" ADD VALUE 'emerald';
ALTER TYPE "Themes" ADD VALUE 'corporate';
ALTER TYPE "Themes" ADD VALUE 'synthwave';
ALTER TYPE "Themes" ADD VALUE 'retro';
ALTER TYPE "Themes" ADD VALUE 'cyberpunk';
ALTER TYPE "Themes" ADD VALUE 'valentine';
ALTER TYPE "Themes" ADD VALUE 'halloween';
ALTER TYPE "Themes" ADD VALUE 'garden';
ALTER TYPE "Themes" ADD VALUE 'forest';
ALTER TYPE "Themes" ADD VALUE 'aqua';
ALTER TYPE "Themes" ADD VALUE 'lofi';
ALTER TYPE "Themes" ADD VALUE 'pastel';
ALTER TYPE "Themes" ADD VALUE 'fantasy';
ALTER TYPE "Themes" ADD VALUE 'wireframe';
ALTER TYPE "Themes" ADD VALUE 'black';
ALTER TYPE "Themes" ADD VALUE 'luxury';
ALTER TYPE "Themes" ADD VALUE 'dracula';
ALTER TYPE "Themes" ADD VALUE 'cmyk';
ALTER TYPE "Themes" ADD VALUE 'autumn';
ALTER TYPE "Themes" ADD VALUE 'business';
ALTER TYPE "Themes" ADD VALUE 'acid';
ALTER TYPE "Themes" ADD VALUE 'lemonade';
ALTER TYPE "Themes" ADD VALUE 'night';
ALTER TYPE "Themes" ADD VALUE 'coffee';
