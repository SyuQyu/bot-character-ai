const { getAllCharacters, createCharacter, updateCharacter, deleteCharacter, getCharacterById } = require("../queries/character.queries");

// Controller for creating a new character
async function createCharacterController(id_characters, name_characters) {
    try {
        const newCharacter = await createCharacter(id_characters, name_characters);
        return newCharacter;
    } catch (error) {
        return error.message;
    }
}

exports.createCharacterController = createCharacterController;

// Controller for retrieving all characters
async function getAllCharactersController() {
    try {
        const characters = await getAllCharacters();
        return characters;
    } catch (error) {
        return error.message;
    }
}

exports.getAllCharactersController = getAllCharactersController;

// Controller for retrieving a character by ID
async function getCharacterByIdController(id) {
    try {
        const character = await getCharacterById(id);
        if (!character) {
            return(`Character with ID ${id} not found`);
        }
        return character;
    } catch (error) {
        return(`Error retrieving character: ${error.message}`);
    }
}

exports.getCharacterByIdController = getCharacterByIdController;

// Controller for updating a character
async function updateCharacterController(req, res) {
    const { id } = req.params;
    const newData = req.body;
    try {
        const updatedCharacter = await updateCharacter(parseInt(id), newData);
        res.json(updatedCharacter);
    } catch (error) {
        return error.message;
    }
}

exports.updateCharacterController = updateCharacterController;

// Controller for deleting a character
async function deleteCharacterController(req, res) {
    const { id } = req.params;
    try {
        const deletedCharacter = await deleteCharacter(parseInt(id));
        res.json(deletedCharacter);
    } catch (error) {
        return error.message;
    }
}

exports.deleteCharacterController = deleteCharacterController;