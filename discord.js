const Discord = require("discord.js");
const CharacterAI = require("node_characterai");
const { GatewayIntentBits } = Discord;

const sessionTokenFromCharacterId = "YOUR_SESSION_TOKEN_ACCOUNT"
const characterId = "YOUR_CHARACTER_ID";
const discordToken = "YOUR_DISCORD_BOT";

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
  if (message.content.startsWith("!wibu")) {
    // Extract the message content after the command prefix
    const content = message.content.slice("!wibu".length).trim();
    // Place your character's id here
    console.log(content);

    // Create a chat object to interact with the conversation
    const chat = await characterAI.createOrContinueChat(characterId);

    // Send the user's message to the AI and await response
    const response = await chat.sendAndAwaitResponse(content, true);

    // Send the AI's response back to the user
    message.channel.send("**Hosino AI:** " + response.text);
  }
});

// Login to Discord with your app's token
client.login(
  discordToken
);
