// @ts-ignore
const { PrismaClient } = require("@prisma/client");
// @ts-ignore
const prisma = new PrismaClient();
const characterId = require("../constants/listCharacters");

async function main() {
    // Create characters using the provided data
    for (const characterData of characterId) {
        await prisma.character.create({
            data: {
                name_characters: characterData.name,
                id_characters: characterData.id,
            },
        });
    }

    // Query all characters to verify insertion
    const allCharacters = await prisma.character.findMany();
    console.dir(allCharacters, { depth: null });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
