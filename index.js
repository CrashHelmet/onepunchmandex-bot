const fs = require("fs");
const path = require("path");
const {
    Client,
    GatewayIntentBits,
    Collection,
    Partials,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    InteractionType,
    REST,
    Routes
} = require("discord.js");

const { characters } = require("./systems/characters");
const { pickByRarity } = require("./systems/rarity");
const { setupSpawnSystem, activeSpawns } = require("./systems/spawnSystem");

const {
    createBallObject,
    addBallToInventory,
    getUserInventory
} = require("./util/saveInventory");

const { getSpawnChannelId } = require("./util/configStore");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ],
    partials: [Partials.Channel]
});

client.commands = new Collection();

// ------------------------------------------------------
// LOAD ALL SLASH COMMANDS
// ------------------------------------------------------
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath)
    .filter(file => file.endsWith(".js"));

const slashCommandsJSON = [];

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if ("data" in command && "execute" in command) {
        client.commands.set(command.data.name, command);
        slashCommandsJSON.push(command.data.toJSON());
    }
}

// ------------------------------------------------------
// REGISTER SLASH COMMANDS
// ------------------------------------------------------
async function registerCommands() {
    const rest = new REST({ version: "10" }).setToken(process.env.BOT_TOKEN);

    try {
        console.log("Registering slash commands…");

        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: slashCommandsJSON }
        );

        console.log("Slash commands registered successfully.");
    } catch (err) {
        console.error("Failed to register commands:", err);
    }
}

client.once("ready", async () => {
    console.log(`Logged in as ${client.user.tag}`);

    await registerCommands();

    setupSpawnSystem(
        client,
        characters,
        pickByRarity,
        activeSpawns,
        ActionRowBuilder,
        ButtonBuilder,
        ButtonStyle,
        getSpawnChannelId
    );
});

// ------------------------------------------------------
// INTERACTION HANDLER
// ------------------------------------------------------
client.on("interactionCreate", async (interaction) => {
    try {
        // AUTOCOMPLETE
        if (interaction.isAutocomplete()) {
            const command = client.commands.get(interaction.commandName);
            if (command?.autocomplete) return command.autocomplete(interaction);
        }

        // SLASH COMMANDS
        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) return;

            try {
                await command.execute(interaction);
            } catch (err) {
                console.error("Slash command error:", err);

                if (!interaction.replied && !interaction.deferred) {
                    await interaction.reply({
                        content: "An error occurred.",
                        flags: 64
                    });
                }
            }
            return;
        }

        // ------------------------------------------------------
        // TOS ACCEPT BUTTON
        // ------------------------------------------------------
        if (interaction.isButton() && interaction.customId === "tos_accept") {
            const { setAcceptedTOS } = require("./util/configStore");

            setAcceptedTOS(interaction.guild.id, true);

            return interaction.update({
                content: "✅ Terms of Service accepted. You may now run `/config channel` to activate the bot.",
                components: []
            });
        }

        // ------------------------------------------------------
        // CATCH BUTTON
        // ------------------------------------------------------
        if (interaction.isButton() && interaction.customId === "catch_character") {
            const spawn = activeSpawns.get(interaction.guild.id);
            if (!spawn || spawn.caught || spawn.fled)
                return interaction.update({ content: "Nothing to catch.", components: [] });

            const modal = new ModalBuilder()
                .setCustomId("catch_modal")
                .setTitle("Who is this character?");

            const input = new TextInputBuilder()
                .setCustomId("guess_input")
                .setLabel("Enter character name")
                .setStyle(TextInputStyle.Short);

            modal.addComponents(new ActionRowBuilder().addComponents(input));
            return interaction.showModal(modal);
        }

        // ------------------------------------------------------
        // CATCH MODAL SUBMIT
        // ------------------------------------------------------
        if (interaction.type === InteractionType.ModalSubmit && interaction.customId === "catch_modal") {
            const spawn = activeSpawns.get(interaction.guild.id);

            if (!spawn || spawn.caught || spawn.fled) {
                await interaction.deferUpdate();
                return interaction.channel.send("Too late.");
            }

            await interaction.deferUpdate();

            const guessRaw = interaction.fields.getTextInputValue("guess_input").trim();
            const guess = guessRaw.toLowerCase();

            const c = spawn.character;

            function normalize(str) {
                return str
                    .toLowerCase()
                    .replace(/[^a-z0-9\s]/g, "")
                    .replace(/\s+/g, " ")
                    .trim();
            }

            const normGuess = normalize(guess);
            const normName = normalize(c.display);

            const guessWords = normGuess.split(" ");
            const nameWords = normName.split(" ");

            const isCorrect =
                normGuess === normName ||
                nameWords.some(w => normGuess === w) ||
                guessWords.some(w => nameWords.includes(w));

            if (!isCorrect) {
                await new Promise(res => setTimeout(res, 150));

                const responses = [
                    `❌ <@${interaction.user.id}> you typed \`${guessRaw}\`. try again.`,
                    `❌ <@${interaction.user.id}> \`${guessRaw}\` isn’t correct. think before you type.`,
                    `❌ <@${interaction.user.id}> nope — \`${guessRaw}\` is wrong.`,
                    `❌ <@${interaction.user.id}> not quite. you said \`${guessRaw}\`.`,
                    `❌ <@${interaction.user.id}> wrong. you put \`${guessRaw}\`. try again.`,
                    `❌ <@${interaction.user.id}> \`${guessRaw}\` won’t cut it. try again.`
                ];

                const msg = responses[Math.floor(Math.random() * responses.length)];
                return interaction.channel.send(msg);
            }

            spawn.caught = true;
            activeSpawns.delete(interaction.guild.id);

            const userId = interaction.user.id;
            const ball = createBallObject(c);

            const rawInv = getUserInventory(userId) || [];
            const userInv = Array.isArray(rawInv) ? rawInv : Object.values(rawInv);
            const alreadyOwned = userInv.some(b => b.slug === c.name);

            addBallToInventory(userId, ball);

            try {
                const msg = await interaction.channel.messages.fetch(spawn.messageId);
                const row = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId("catch_character")
                        .setLabel("Caught")
                        .setStyle(ButtonStyle.Success)
                        .setDisabled(true)
                );
                await msg.edit({ components: [row] });
            } catch {}

            const id = ball.id;

            function randMod() {
                const n = Math.floor(Math.random() * 101) - 50;
                return (n > 0 ? `+${n}%` : `${n}%`);
            }

            let msgText =
                `🎉 <@${interaction.user.id}> You caught **${c.display}**! \`(#${id}, ${randMod()}/${randMod()})\``;

            if (!alreadyOwned) {
                msgText += `
                \nThis is a **new character** added to your collection!`;
            }

            return interaction.channel.send(msgText);
        }

        // ------------------------------------------------------
        // BUTTON ROUTERS
        // ------------------------------------------------------

        if (interaction.isButton() && interaction.customId.startsWith("battle|")) {
            const handler = require("./commands/battle.js").button;
            return handler(interaction);
        }

        if (interaction.isButton() && interaction.customId.startsWith("trade_")) {
            const handler = require("./commands/trade.js").buttonHandler;
            return handler(interaction);
        }

        if (interaction.isButton() && interaction.customId.startsWith("give|")) {
            const handler = require("./commands/give.js").button;
            return handler(interaction);
        }

        if (interaction.isButton() && interaction.customId.startsWith("opmcompletion")) {
            const handler = require("./commands/completion.js").buttonHandler;
            return handler(interaction);
        }

    } catch (err) {
        console.error("Global interaction error:", err);

        if (interaction.isRepliable?.()) {
            interaction.reply({ content: "An error occurred.", flags: 64 }).catch(() => {});
        }
    }
});

client.login(process.env.BOT_TOKEN);
