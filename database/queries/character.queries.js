// @ts-ignore
const { PrismaClient } = require("@prisma/client");
// @ts-ignore
const prisma = new PrismaClient();

// Create a new character
async function createCharacter(id_characters, name_characters) {
    try {
        const newCharacter = await prisma.character.create({
            data: {
                id_characters,
                name_characters,
            },
        });
        return newCharacter;
    } catch (error) {
        throw new Error(`Error creating character: ${error.message}`);
    }
}
exports.createCharacter = createCharacter;

// Retrieve all characters
async function getAllCharacters() {
    try {
        const characters = await prisma.character.findMany();
        return characters;
    } catch (error) {
        throw new Error(`Error retrieving characters: ${error.message}`);
    }
}
exports.getAllCharacters = getAllCharacters;

// Retrieve a character by ID
async function getCharacterById(id) {
    try {
        const character = await prisma.character.findUnique({
            where: {
                id: parseInt(id)
            }
        });
        return character;
    } catch (error) {
        throw new Error(`Error retrieving character with ID ${id}: ${error.message}`);
    }
}

exports.getCharacterById = getCharacterById;

// Update a character by id
async function updateCharacter(id, data) {
    try {
        const updatedCharacter = await prisma.character.update({
            where: { id },
            data,
        });
        return updatedCharacter;
    } catch (error) {
        throw new Error(`Error updating character: ${error.message}`);
    }
}
exports.updateCharacter = updateCharacter;

// Delete a character by id
async function deleteCharacter(id) {
    try {
        const deletedCharacter = await prisma.character.delete({
            where: { id },
        });
        return deletedCharacter;
    } catch (error) {
        throw new Error(`Error deleting character: ${error.message}`);
    }
}
exports.deleteCharacter = deleteCharacter;
