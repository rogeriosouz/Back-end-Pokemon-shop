-- CreateTable
CREATE TABLE "AttributesOnPokemon" (
    "pokemonId" TEXT NOT NULL,
    "attributeID" TEXT NOT NULL,

    PRIMARY KEY ("pokemonId", "attributeID"),
    CONSTRAINT "AttributesOnPokemon_pokemonId_fkey" FOREIGN KEY ("pokemonId") REFERENCES "Pokemon" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "AttributesOnPokemon_attributeID_fkey" FOREIGN KEY ("attributeID") REFERENCES "Attribute" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
