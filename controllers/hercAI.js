/* Importing The Package */
const { Hercai } = require('hercai');
const Discord = require("discord.js");
const herc = new Hercai(); //new Hercai("your api key"); => Optional

async function chatBotAI(message) {
    const content = message.content.slice("gpt!chat".length).trim();
    if (!content) {
        message.channel.send("Please provide a message after `gpt!chat <message>`.");
        return;
    }
    console.log(content);
    /* Available Models */
    /* "v3" , "v3-32k" , "turbo" , "turbo-16k" , "gemini" */
    /* Default Model; "v3" */
    /* Premium Parameter; personality => Optional */
    await herc.question({ model: "gemini", content: content }).then(response => {
        message.channel.send(
            response.reply
        );
    }).catch(err => {
        console.log(err);
        message.channel.send("Failed to get a response from the AI. " + err);
    });
}

async function genImageBotAI(message) {
    const content = message.content.slice("gpt!genImage".length).trim();
    // Check if there's any content after the command
    if (!content) {
        message.channel.send("Please provide a message after `gpt!genImage <message>`.");
        return;
    }
    /* Available Models */
    /* "v1" , "v2" , "v2-beta" , "v3" (DALL-E) , "lexica" , "prodia", "simurg", "animefy", "raava", "shonin" */
    /* Default Model; "v3" */
    await herc.drawImage({ model: "v3", prompt: content, negative_prompt: "" }).then(response => {
        console.log(response.url);
        if (response.url) {
            const embed = new Discord.EmbedBuilder()
                .setTitle("**Made by Hercai** - " + content)
                .setImage(response.url)
                .setColor("#008080")
                .setTimestamp();
            message.channel.send({ embeds: [embed] });
        } else {
            message.channel.send("Failed to generate the image.");
        }

    }).catch(err => {
        console.log(err);
        message.channel.send("Failed to generate the image. " + err);
    });
}

module.exports = {
    chatBotAI,
    genImageBotAI
};