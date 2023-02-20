-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('admin', 'member');

-- CreateEnum
CREATE TYPE "ItemTypes" AS ENUM ('ability', 'weapon', 'armor', 'material');

-- CreateTable
CREATE TABLE "AbilityEffects" (
    "name" TEXT NOT NULL,
    "percent" BOOLEAN NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "AbilityEffects_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "Abilities" (
    "name" TEXT NOT NULL,

    CONSTRAINT "Abilities_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "DropArias" (
    "name" TEXT NOT NULL,

    CONSTRAINT "DropArias_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "ItemPriceAverage" (
    "id" TEXT NOT NULL,
    "ship" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "itemsId" TEXT NOT NULL,

    CONSTRAINT "ItemPriceAverage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Items" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "rarity" INTEGER NOT NULL,
    "type" "ItemTypes" NOT NULL,
    "abilitiesName" TEXT,
    "iconUrl" TEXT NOT NULL,

    CONSTRAINT "Items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemPrices" (
    "id" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "ship" INTEGER NOT NULL,
    "reporterId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "itemId" TEXT NOT NULL,

    CONSTRAINT "ItemPrices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DefaultAvatars" (
    "username" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "DefaultAvatars_pkey" PRIMARY KEY ("username")
);

-- CreateTable
CREATE TABLE "Files" (
    "hash" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "UUIDFilename" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Files_pkey" PRIMARY KEY ("hash")
);


-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL,
    "auth0Id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "description" TEXT,
    "avatarUrl" TEXT,
    "discordId" TEXT,
    "ship" INTEGER NOT NULL DEFAULT 8,
    "bannerUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Teams" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "ship" INTEGER NOT NULL,
    "usersId" TEXT NOT NULL,

    CONSTRAINT "Teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRoles" (
    "name" "Roles" NOT NULL,
    "canCreateReport" BOOLEAN NOT NULL,
    "usersId" TEXT,

    CONSTRAINT "UserRoles_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "UserSettings" (
    "id" TEXT NOT NULL,
    "useDarkTheme" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Diaries" (
    "id" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "filesHash" TEXT NOT NULL,

    CONSTRAINT "Diaries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AbilitiesToAbilityEffects" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_DropAriasToItems" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_TeamsToUsers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Items_name_key" ON "Items"("name");

-- CreateIndex
CREATE UNIQUE INDEX "DefaultAvatars_url_key" ON "DefaultAvatars"("url");

-- CreateIndex
CREATE UNIQUE INDEX "Files_filename_key" ON "Files"("filename");

-- CreateIndex
CREATE UNIQUE INDEX "Files_UUIDFilename_key" ON "Files"("UUIDFilename");

-- CreateIndex
CREATE UNIQUE INDEX "Users_username_key" ON "Users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "UserSettings_userId_key" ON "UserSettings"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "_AbilitiesToAbilityEffects_AB_unique" ON "_AbilitiesToAbilityEffects"("A", "B");

-- CreateIndex
CREATE INDEX "_AbilitiesToAbilityEffects_B_index" ON "_AbilitiesToAbilityEffects"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_DropAriasToItems_AB_unique" ON "_DropAriasToItems"("A", "B");

-- CreateIndex
CREATE INDEX "_DropAriasToItems_B_index" ON "_DropAriasToItems"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_TeamsToUsers_AB_unique" ON "_TeamsToUsers"("A", "B");

-- CreateIndex
CREATE INDEX "_TeamsToUsers_B_index" ON "_TeamsToUsers"("B");

-- AddForeignKey
ALTER TABLE "ItemPriceAverage" ADD CONSTRAINT "ItemPriceAverage_itemsId_fkey" FOREIGN KEY ("itemsId") REFERENCES "Items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Items" ADD CONSTRAINT "Items_abilitiesName_fkey" FOREIGN KEY ("abilitiesName") REFERENCES "Abilities"("name") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemPrices" ADD CONSTRAINT "ItemPrices_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemPrices" ADD CONSTRAINT "ItemPrices_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Files" ADD CONSTRAINT "Files_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teams" ADD CONSTRAINT "Teams_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRoles" ADD CONSTRAINT "UserRoles_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSettings" ADD CONSTRAINT "UserSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Diaries" ADD CONSTRAINT "Diaries_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Diaries" ADD CONSTRAINT "Diaries_filesHash_fkey" FOREIGN KEY ("filesHash") REFERENCES "Files"("hash") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AbilitiesToAbilityEffects" ADD CONSTRAINT "_AbilitiesToAbilityEffects_A_fkey" FOREIGN KEY ("A") REFERENCES "Abilities"("name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AbilitiesToAbilityEffects" ADD CONSTRAINT "_AbilitiesToAbilityEffects_B_fkey" FOREIGN KEY ("B") REFERENCES "AbilityEffects"("name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DropAriasToItems" ADD CONSTRAINT "_DropAriasToItems_A_fkey" FOREIGN KEY ("A") REFERENCES "DropArias"("name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DropAriasToItems" ADD CONSTRAINT "_DropAriasToItems_B_fkey" FOREIGN KEY ("B") REFERENCES "Items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TeamsToUsers" ADD CONSTRAINT "_TeamsToUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "Teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TeamsToUsers" ADD CONSTRAINT "_TeamsToUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
