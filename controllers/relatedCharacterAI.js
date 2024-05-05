const Discord = require("discord.js");
const { withMutex } = require("../utils/mutex");
const { cutText } = require("../utils/cutText");
const characterId = require('../constants/listCharacters');

let selectedCharacter = null;

async function handleListCommand(message) {
    let characterList = "List of characters:\n";
    characterId.forEach((character, index) => {
        characterList += `${index + 1}. ${character.name}\n`;
    });
    message.channel.send(characterList);
}

async function handleSelectCommand(
    message,
    characterAI
) {
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
}

async function handleChatCommand(message, characterAI) {
    const content = message.content.slice("w!chat".length).trim();
    await withMutex(async () => {
        chat = await characterAI.createOrContinueChat(selectedCharacter.id);
        const response = await chat.sendAndAwaitResponse(content, true);
        message.channel.send(`${selectedCharacter.name}: ` + response.text);
        if (selectedCharacter?.name === "**RPG Roleplay**") {
            const cutTextGen = await cutText(".", response.text);
            const imageURL = await chat.generateImage(cutTextGen);
            console.log(imageURL);
            if (imageURL) {
                const embed = new Discord.EmbedBuilder()
                    .setTitle(cutTextGen)
                    .setImage(imageURL)
                    .setColor("#008080")
                    .setTimestamp();
                message.channel.send({ embeds: [embed] });
            }
        }
    });
}

async function handleGenImageCommand(message, characterAI) {
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
        const imageURL = await chat.generateImage(content);
        console.log(imageURL);
        if (imageURL) {
            const embed = new Discord.EmbedBuilder()
                .setTitle(content)
                .setImage(imageURL)
                .setColor("#008080")
                .setTimestamp();
            message.channel.send({ embeds: [embed] });
        } else {
            message.channel.send("Failed to generate the image.");
        }
    });
}


module.exports = {
    handleListCommand,
    handleSelectCommand,
    handleChatCommand,
    handleGenImageCommand,
};
