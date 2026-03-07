const fs = require("fs");
const path = require("path");
const { REST, Routes } = require("discord.js");

const commands = [];

const commandsPath = path.join(__dirname, "commands");

// Load ONLY real slash command files
const commandFiles = ["opm.js", "config.js"];

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    if ("data" in command) {
        commands.push(command.data.toJSON());
    }
}

const rest = new REST({ version: "10" }).setToken(process.env.BOT_TOKEN);

(async () => {
    try {
        console.log("Refreshing application (/) commands…");

        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands }
        );

        console.log("Successfully reloaded commands.");
    } catch (error) {
        console.error(error);
    }
})();
