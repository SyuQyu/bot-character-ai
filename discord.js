const Discord = require("discord.js");
const CharacterAI = require("node_characterai");
const { handleListCommand,
  handleSelectCommand,
  handleChatCommand,
  handleGenImageCommand
} = require("./controllers/relatedCharacterAI");
const { chatBotAI,
  genImageBotAI
} = require("./controllers/hercAI");
const { GatewayIntentBits } = Discord;
require("dotenv").config();
const sessionTokenFromCharacterId = process.env.sessionTokenFromCharacterId;
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
  if (message.content.startsWith("w!list")) {
    await handleListCommand(message);
  } else if (message.content.startsWith("w!select")) {
    await handleSelectCommand(message, characterAI);
  } else if (message.content.startsWith("w!chat")) {
    await handleChatCommand(message, characterAI);
  } else if (message.content.startsWith("w!genImage")) {
    await handleGenImageCommand(message, characterAI);
  } else if (message.content.startsWith("gpt!chat")) {
    console.log("gpt!chat" + message.content);
    await chatBotAI(message);
  } else if (message.content.startsWith("gpt!genImage")) {
    await genImageBotAI(message);
  } else if (message.content.startsWith("w!help")) {
    handleHelpCommand(message);
  }
});

async function handleHelpCommand(message) {
  message.channel.send(
    "Available commands:\n`w!list` - List of characters\n`w!select <number>` - Select a character\n`w!chat <message>` - Chat with the selected character\n`w!genImage <message>` - Generate an image based on the message\n`gpt!chat <message>` - Chat with the AI\n`gpt!genImage <message>` - Generate an image based on the message\n`w!help` - List of available commands"
  );
}


// Login to Discord with your app's token
client.login(discordToken);
