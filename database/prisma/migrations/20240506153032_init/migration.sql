-- CreateTable
CREATE TABLE "Character" (
    "id" SERIAL NOT NULL,
    "id_characters" TEXT NOT NULL,
    "name_characters" TEXT NOT NULL,

    CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Character_id_characters_key" ON "Character"("id_characters");
