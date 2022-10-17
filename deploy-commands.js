require("dotenv").config()
const { REST, Routes } = require('discord.js');
const fs = require('node:fs');

const commands = [];

// Grab all command files from commands directory
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Grab the SlashCOmmandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
}

// Construct and prepare an instance of the REST module

const rest = new REST({ version: '10'}).setToken(process.env.Discord_Token);

// Deploy your commands!
(async () => {
  try {
    console.log(`Started refreshing ${commands.length} applictation (/) commands.`);

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(
      Routes.applicationGuildCommands(process.env.clientId, process.env.guildId),
      { body: commands },
    );

    console.log(`Successfully reloaded ${data.length} application (/) commands.`);
  } catch (error) {
    // For errors
    console.error(error);
  }
})();
