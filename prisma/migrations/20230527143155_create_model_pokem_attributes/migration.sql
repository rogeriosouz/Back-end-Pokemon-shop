-- CreateTable
CREATE TABLE "PokemonAttribute" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "attributeId" TEXT NOT NULL,
    "pokemonId" TEXT NOT NULL,
    CONSTRAINT "PokemonAttribute_attributeId_fkey" FOREIGN KEY ("attributeId") REFERENCES "Attribute" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PokemonAttribute_pokemonId_fkey" FOREIGN KEY ("pokemonId") REFERENCES "Pokemon" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "PokemonAttribute_id_key" ON "PokemonAttribute"("id");

-- CreateIndex
CREATE UNIQUE INDEX "PokemonAttribute_attributeId_pokemonId_key" ON "PokemonAttribute"("attributeId", "pokemonId");
