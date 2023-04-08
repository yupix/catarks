-- CreateTable
CREATE TABLE "UserShortCuts" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "usersId" TEXT NOT NULL,
    "itemsId" TEXT NOT NULL,

    CONSTRAINT "UserShortCuts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserShortCuts_usersId_itemsId_key" ON "UserShortCuts"("usersId", "itemsId");

-- AddForeignKey
ALTER TABLE "UserShortCuts" ADD CONSTRAINT "UserShortCuts_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserShortCuts" ADD CONSTRAINT "UserShortCuts_itemsId_fkey" FOREIGN KEY ("itemsId") REFERENCES "Items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
