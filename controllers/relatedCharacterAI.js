const Discord = require("discord.js");
const { withMutex } = require("../utils/mutex");
const { cutText } = require("../utils/cutText");
const characterId = require('../constants/listCharacters');

let selectedCharacter = null;

async function handleListCommand(message) {
    try {
        let characterList = "List of characters:\n";
        characterId.forEach((character, index) => {
            characterList += `${index + 1}. ${character.name}\n`;
        });
        message.channel.send(characterList);
    } catch (error) {
        console.error("Error handling list command:", error);
        message.channel.send("An error occurred while handling the list command.");
    }
}

async function handleSelectCommand(
    message,
    characterAI
) {
    try {
        if (selectedCharacter !== null) {
            selectedCharacter = null;
        }
        const content = message.content.slice("w!select".length).trim();
        selectedCharacter = characterId[content - 1];

        if (!selectedCharacter) {
            message.channel.send(
                "Sorry, that character doesn't exist. choose with number \nPlease select a character first using `w!select` command. \nexample `w!select 1`."
            );
            return; // Stop execution if character doesn't exist
        }

        console.log(selectedCharacter);
        if (selectedCharacter) {
            const data = await characterAI.fetchCharacterInfo(selectedCharacter.id);
            message.channel.send(
                `Selected ${selectedCharacter.name} \n` +
                "You can now chat with the selected character using `w!chat <message>` command. \n" +
                `${selectedCharacter.name}: ` +
                data?.greeting
            );
        }
    } catch (error) {
        console.error("Error handling select command:", error);
        message.channel.send("An error occurred while handling the select command.");
    }
}

async function handleChatCommand(message, characterAI) {
    try {
        if(selectedCharacter === null) {
            message.channel.send("Please select a character first using `w!select`.");
            return;
        }
        const content = message.content.slice("w!chat".length).trim();
        await withMutex(async () => {
            chat = await characterAI.createOrContinueChat(selectedCharacter.id);
            const response = await chat.sendAndAwaitResponse(content, true);
            message.channel.send(`${selectedCharacter.name}: ` + response.text);
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
    } catch (error) {
        console.error("Error handling chat command:", error);
        message.channel.send("An error occurred while handling the chat command.");
    }
}

async function handleGenImageCommand(message, characterAI) {
    try {
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
    } catch (error) {
        console.error("Error handling genImage command:", error);
        message.channel.send("An error occurred while handling the genImage command.");
    }
}

module.exports = {
    handleListCommand,
    handleSelectCommand,
    handleChatCommand,
    handleGenImageCommand,
};
