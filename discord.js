const Discord = require("discord.js");
const CharacterAI = require("node_characterai");
const { GatewayIntentBits } = Discord;
require("dotenv").config();
const sessionTokenFromCharacterId = process.env.sessionTokenFromCharacterId;
const characterId = "your_character_id_here"

let selectedCharacter = null;
const discordToken = process.env.discordToken;

const characterAI = new CharacterAI();
const client = new Discord.Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});
// Authenticating as a guest (use `.authenticateWithToken()` to use an account)
// await characterAI.authenticateAsGuest();
characterAI.authenticateWithToken(sessionTokenFromCharacterId);

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", async (message) => {
  // Check if the message starts with the command prefix
  if (message.content.startsWith("w!list")) {
    let characterList = "List of characters:\n";
    characterId.forEach((character, index) => {
      characterList += `${index + 1}. ${character.name}\n`;
    });
    message.channel.send(characterList);
  }

  if (message.content.startsWith("w!select")) {
    if (selectedCharacter !== null) {
      selectedCharacter = null;
    }
    const content = message.content.slice("w!select".length).trim();
    selectedCharacter = characterId[content - 1];
    console.log(selectedCharacter);
    if (selectedCharacter) {
      const data = await characterAI.fetchCharacterInfo(selectedCharacter.id);
      message.channel.send(`Selected ${selectedCharacter.name}`);
      message.channel.send(
        "You can now chat with the selected character using `w!chat` command."
      );
      message.channel.send(`${selectedCharacter.name}: ` + data?.greeting);
    }
  }

  if (message.content.startsWith("w!chat")) {
    if (selectedCharacter !== null) {
      // Extract the message content after the command prefix
      const content = message.content.slice("w!chat".length).trim();
      // Place your character's id here
      console.log(content);
      // Create a chat object to interact with the conversation
      const chat = await characterAI.createOrContinueChat(selectedCharacter.id);
      // Send the user's message to the AI and await response
      const response = await chat.sendAndAwaitResponse(content, true);
      console.log(response);
      // Send the AI's response back to the user
      message.channel.send(`${selectedCharacter.name}: ` + response.text);
      if (selectedCharacter?.name === "**RPG Roleplay**") {
        const imageURL = await chat.generateImage(response.text);
        console.log(imageURL);
        // Check if imageURL exists
        if (imageURL) {
          // Create a EmbedBuilder containing the image URL
          const embed = new Discord.EmbedBuilder()
            .setTitle(response.text)
            .setImage(imageURL)
            .setColor("#008080")
            .setTimestamp(); // You can set any color you like
          // Send the embedded message with the image URL
          message.channel.send({
            embeds: [embed],
          });
        }
      }
    } else {
      message.channel.send(
        "Please select a character first using `w!select` command."
      );
    }
  }

  if (message.content.startsWith("w!genImage")) {
    const content = message.content.slice("w!genImage".length).trim();

    // Create a chat object to interact with the conversation
    const chat = await characterAI.createOrContinueChat(selectedCharacter.id);

    // Assuming chat.generateImage(content) returns the URL of the image
    const imageURL = await chat.generateImage(content);
    console.log(imageURL);
    // Check if imageURL exists
    if (imageURL) {
      // Create a EmbedBuilder containing the image URL
      const embed = new Discord.EmbedBuilder()
        .setTitle(content)
        .setImage(imageURL)
        .setColor("#008080")
        .setTimestamp(); // You can set any color you like

      // Send the embedded message with the image URL
      message.channel.send({
        embeds: [embed],
      });
    } else {
      message.channel.send("Failed to generate the image.");
    }
  }

  if (message.content.startsWith("w!help")) {
    message.channel.send(
      "Available commands:\n`w!list` - List of characters\n`w!select <number>` - Select a character\n`w!chat <message>` - Chat with the selected character\n`w!genImage <message>` - Generate an image based on the message\n`w!help` - List of available commands"
    );
  }
});

// Login to Discord with your app's token
client.login(discordToken);
