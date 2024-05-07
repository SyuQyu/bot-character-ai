const Discord = require("discord.js");
const { withMutex } = require("../utils/mutex");
const { cutText } = require("../utils/cutText");
const { getAllCharactersController, createCharacterController, getCharacterByIdController } = require("../database/controllers/character.controllers")
let selectedCharacter = null;

async function sendPleaseWaitMessage(message) {
    // Send the "please wait" message
    const waitMessage = await message.channel.send("Please wait...");

    // Return a function to remove the message once processing is complete
    return () => waitMessage.delete();
}

async function handleListCommand(message) {
    // Send "please wait" message and get a function to remove it
    const removeWaitMessage = await sendPleaseWaitMessage(message);

    let characterList = "List of characters:\n";
    const characters = await getAllCharactersController();
    console.log("test", characters)
    await characters.forEach((character, index) => {
        characterList += `${index}. **${character.name_characters}**\n`;
    });
    message.channel.send(characterList);

    // Remove the "please wait" message after processing
    await removeWaitMessage();
}

async function handleAddCommand(message) {
    // Send "please wait" message and get a function to remove it
    const removeWaitMessage = await sendPleaseWaitMessage(message);

    try {
        const content = message.content.slice("w!add".length).trim();
        const [characterId, ...characterNameParts] = content.split(/\s+/); // Split content by whitespace
        const characterIdTrimmed = characterId?.trim();
        const characterNameTrimmed = characterNameParts.join(' ').trim(); // Join remaining parts to form the name

        if (!characterIdTrimmed || !characterNameTrimmed) {
            message.channel.send("Invalid command format. Please use `w!add <id> <name>`.");
            return;
        }

        const characterDataAdded = await createCharacterController(characterIdTrimmed, characterNameTrimmed);
        message.channel.send(`Character **${characterNameTrimmed}** added with ID: ${characterDataAdded.id_characters}`);
    } catch (error) {
        console.error("Error occurred while adding character:", error);
        message.channel.send("An error occurred while adding the character. Please try again later.");
    }

    // Remove the "please wait" message after processing
    await removeWaitMessage();
}

async function handleSelectCommand(
    message,
    characterAI
) {
    // Send "please wait" message and get a function to remove it
    const removeWaitMessage = await sendPleaseWaitMessage(message);

    if (selectedCharacter !== null) {
        selectedCharacter = null;
    }
    const content = message.content.slice("w!select".length).trim();
    selectedCharacter = await getCharacterByIdController(content);
    // selectedCharacter = characterId[content - 1];

    if (!selectedCharacter) {
        message.channel.send(
            "Sorry, that character doesn't exist. choose with number \nPlease select a character first using `w!select` command. \nexample `w!select 1`."
        );
        return; // Stop execution if character doesn't exist
    }

    console.log(selectedCharacter);
    if (selectedCharacter) {
        const data = await characterAI.fetchCharacterInfo(selectedCharacter.id_characters);
        message.channel.send(
            `Selected **${selectedCharacter.name_characters}** \n` +
            "You can now chat with the selected character using `w!chat <message>` command. \n" +
            `**${selectedCharacter.name_characters}**: ` +
            data?.greeting
        );
    }

    // Remove the "please wait" message after processing
    await removeWaitMessage();
}

async function handleChatCommand(message, characterAI) {
    // Send "please wait" message and get a function to remove it
    const removeWaitMessage = await sendPleaseWaitMessage(message);

    const content = message.content.slice("w!chat".length).trim();
    await withMutex(async () => {
        chat = await characterAI.createOrContinueChat(selectedCharacter.id);
        const response = await chat.sendAndAwaitResponse(content, true);
        message.channel.send(`**${selectedCharacter.name}**: ` + response.text);
        if (selectedCharacter?.name === "**RPG Roleplay**") {
            try {
                const cutTextGen = await cutText(".", response.text);
                const imageURL = await chat.generateImage(cutTextGen);
                console.log(imageURL);
                const embed = new Discord.EmbedBuilder()
                    .setTitle(cutTextGen)
                    .setImage(imageURL)
                    .setColor("#008080")
                    .setTimestamp();
                message.channel.send({ embeds: [embed] });
            } catch (error) {
                console.error("Error generating image:", error);
                message.channel.send(`Image not successfully generated: ` + error);
                // Log the error and handle it accordingly, e.g., notify the user or take other actions.
            }
        }
    });

    // Remove the "please wait" message after processing
    await removeWaitMessage();
}

async function handleGenImageCommand(message, characterAI) {
    // Send "please wait" message and get a function to remove it
    const removeWaitMessage = await sendPleaseWaitMessage(message);

    if (!selectedCharacter) {
        message.channel.send("Please select a character first using `w!select`.");
        return;
    }

    const content = message.content.slice("w!genImage".length).trim();

    // Check if there's any content after the command
    if (!content) {
        message.channel.send("Please provide a message after `w!genImage <message>`.");
        return;
    }

    await withMutex(async () => {
        chat = await characterAI.createOrContinueChat(selectedCharacter.id);
        try {
            const imageURL = await chat.generateImage(content);
            console.log(imageURL);
            const embed = new Discord.EmbedBuilder()
                .setTitle(content)
                .setImage(imageURL)
                .setColor("#008080")
                .setTimestamp();
            message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error("Error generating image:", error);
            message.channel.send(`Image not successfully generated: ` + error);
            // Log the error and handle it accordingly, e.g., notify the user or take other actions.
        }
    });

    // Remove the "please wait" message after processing
    await removeWaitMessage();
}


module.exports = {
    handleListCommand,
    handleSelectCommand,
    handleChatCommand,
    handleGenImageCommand,
    handleAddCommand
};
