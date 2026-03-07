// commands/opm.js

const { SlashCommandBuilder } = require("discord.js");

const battle = require("./battle.js");
const trade = require("./trade.js");
const give = require("./give.js");
const info = require("./info.js");
const rarity = require("./rarityinfo.js");
const completion = require("./completion.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("opm")
        .setDescription("OPM Dex commands.")

        .addSubcommandGroup(group =>
            group
                .setName("battle")
                .setDescription("Battle other players")
                .addSubcommand(sub =>
                    sub
                        .setName("start")
                        .setDescription("Start a battle with another user")
                        .addUserOption(o =>
                            o.setName("user")
                                .setDescription("User to battle")
                                .setRequired(true)
                        )
                )
                .addSubcommand(sub =>
                    sub
                        .setName("add")
                        .setDescription("Add a character to your battle deck")
                        .addStringOption(o =>
                            o.setName("character")
                                .setDescription("Character to add")
                                .setRequired(true)
                                .setAutocomplete(true)
                        )
                )
                .addSubcommand(sub =>
                    sub
                        .setName("remove")
                        .setDescription("Remove a character from your battle deck")
                        .addStringOption(o =>
                            o.setName("character")
                                .setDescription("Character ID to remove")
                                .setRequired(true)
                                .setAutocomplete(true)
                        )
                )
                .addSubcommand(sub =>
                    sub
                        .setName("cancel")
                        .setDescription("Cancel your current battle")
                )
        )

        .addSubcommandGroup(group =>
            group
                .setName("trade")
                .setDescription("Trade characters with another user")
                .addSubcommand(sub =>
                    sub
                        .setName("start")
                        .setDescription("Start a trade with another user")
                        .addUserOption(o =>
                            o.setName("user")
                                .setDescription("User to trade with")
                                .setRequired(true)
                        )
                )
                .addSubcommand(sub =>
                    sub
                        .setName("add")
                        .setDescription("Add a character to your trade offer")
                        .addStringOption(o =>
                            o.setName("character")
                                .setDescription("Character to add")
                                .setRequired(true)
                                .setAutocomplete(true)
                        )
                )
                .addSubcommand(sub =>
                    sub
                        .setName("remove")
                        .setDescription("Remove a character from your trade offer")
                        .addStringOption(o =>
                            o.setName("character")
                                .setDescription("Character ID to remove")
                                .setRequired(true)
                                .setAutocomplete(true)
                        )
                )
                .addSubcommand(sub =>
                    sub
                        .setName("view")
                        .setDescription("View the current trade session")
                )
                .addSubcommand(sub =>
                    sub
                        .setName("cancel")
                        .setDescription("Cancel your current trade session")
                )
        )

        .addSubcommand(sub =>
            sub
                .setName("give")
                .setDescription("Give a character to another user")
                .addUserOption(o =>
                    o.setName("user")
                        .setDescription("Recipient")
                        .setRequired(true)
                )
                .addStringOption(o =>
                    o.setName("character")
                        .setDescription("Character to give")
                        .setRequired(true)
                        .setAutocomplete(true)
                )
        )

        .addSubcommand(sub =>
            sub
                .setName("info")
                .setDescription("View your collected OPM characters")
                .addStringOption(o =>
                    o.setName("character")
                        .setDescription("Filter by a specific character")
                        .setAutocomplete(true)
                )
        )

        .addSubcommand(sub =>
            sub
                .setName("rarity")
                .setDescription("View rarity info for any OPM character")
                .addStringOption(o =>
                    o.setName("character")
                        .setDescription("Choose a character")
                        .setRequired(true)
                        .setAutocomplete(true)
                )
        )

        .addSubcommand(sub =>
            sub
                .setName("completion")
                .setDescription("Show your OPMDex completion")
                .addUserOption(o =>
                    o.setName("user")
                        .setDescription("User to check")
                )
        ),

    async execute(interaction) {
        const group = interaction.options.getSubcommandGroup(false);
        const sub = interaction.options.getSubcommand();

        if (group === "battle") return battle.execute(interaction);
        if (group === "trade") return trade.execute(interaction);

        if (sub === "give") return give.execute(interaction);
        if (sub === "info") return info.execute(interaction);
        if (sub === "rarity") return rarity.execute(interaction);
        if (sub === "completion") return completion.execute(interaction);
    },

    async autocomplete(interaction) {
        const group = interaction.options.getSubcommandGroup(false);
        const sub = interaction.options.getSubcommand(false);

        if (group === "battle") return battle.autocomplete?.(interaction);
        if (group === "trade") return trade.autocomplete?.(interaction);

        if (sub === "give") return give.autocomplete?.(interaction);
        if (sub === "info") return info.autocomplete?.(interaction);
        if (sub === "rarity") return rarity.autocomplete?.(interaction);
        if (sub === "completion") return completion.autocomplete?.(interaction);
    }
};
