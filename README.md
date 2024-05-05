# Discord Character AI Bot

This Discord bot allows users to interact with various AI characters using text commands. The bot uses the Node.js Discord.js library for interacting with Discord's API and the node_characterai library for communicating with the AI characters.

## Features

- List characters available for interaction.
- Select a character to interact with.
- Chat with the selected character.
- Generate an image based on the conversation with certain characters.
- Get help on available commands.

## Usage

1. Clone the repository:


2. Install dependencies:


3. Set up environment variables:

   - `sessionTokenFromCharacterId`: Session token for authentication with the Character AI service.
   - `discordToken`: Discord bot token.
   - `constants/listCharacters.js`: Contains the list of characters available for interaction.

4. Run the bot:


5. Invite the bot to your Discord server and start interacting!

## Commands

- `w!list`: List available characters.
- `w!select <number>`: Select a character.
- `w!chat <message>`: Chat with the selected character.
- `w!genImage <message>`: Generate an image based on the conversation.
- `w!help`: Get help on available commands.

## Dependencies

- `discord.js`: Library for interacting with Discord's API.
- `node_characterai`: Library for communicating with AI characters.
- `dotenv`: Library for loading environment variables from a `.env` file.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
