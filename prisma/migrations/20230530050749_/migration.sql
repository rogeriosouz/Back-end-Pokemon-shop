/*
  Warnings:

  - You are about to drop the `MyPokemon` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `Attribute` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[colorRex]` on the table `Attribute` will be added. If there are existing duplicate values, this will fail.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "MyPokemon";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "UserPokemon" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "create_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UserPokemon_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_AttributeToUserPokemon" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_AttributeToUserPokemon_A_fkey" FOREIGN KEY ("A") REFERENCES "Attribute" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_AttributeToUserPokemon_B_fkey" FOREIGN KEY ("B") REFERENCES "UserPokemon" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "UserPokemon_id_key" ON "UserPokemon"("id");

-- CreateIndex
CREATE UNIQUE INDEX "_AttributeToUserPokemon_AB_unique" ON "_AttributeToUserPokemon"("A", "B");

-- CreateIndex
CREATE INDEX "_AttributeToUserPokemon_B_index" ON "_AttributeToUserPokemon"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Attribute_name_key" ON "Attribute"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Attribute_colorRex_key" ON "Attribute"("colorRex");
