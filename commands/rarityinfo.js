// commands/rarityinfo.js

const { EmbedBuilder } = require("discord.js");
const { characters } = require("../systems/characters");
const {
    rarityLabels,
    getBalancedPercent,
    getRarityTier
} = require("../systems/rarity");

// --------------------------------------
// AUTOCOMPLETE HANDLER
// --------------------------------------
module.exports.autocomplete = async function (interaction) {
    const sub = interaction.options.getSubcommand(false);
    if (sub !== "rarity") return;

    const focused = interaction.options.getFocused().toLowerCase();

    let results = characters;

    if (focused.length > 0) {
        results = characters.filter(c =>
            c.name.toLowerCase().includes(focused) ||
            c.display.toLowerCase().includes(focused) ||
            c.aliases.some(a => a.toLowerCase().includes(focused))
        );
    }

    results = results.slice(0, 25);

    return interaction.respond(
        results.map(c => ({
            name: c.display,
            value: c.name
        }))
    );
};

// --------------------------------------
// EXECUTE HANDLER (called by opm.js)
// --------------------------------------
module.exports.execute = async function (interaction) {
    const sub = interaction.options.getSubcommand();
    if (sub !== "rarity") {
        return interaction.reply({
            content: "Invalid subcommand.",
            ephemeral: true
        });
    }

    const name = interaction.options.getString("character");
    const c = characters.find(x => x.name === name);

    if (!c) {
        return interaction.reply({
            content: "Character not found.",
            ephemeral: true
        });
    }

    const rarityChance = getBalancedPercent(c.rarity);
    const tier = getRarityTier(rarityChance);
    const label = rarityLabels[c.rarity];

    const embed = new EmbedBuilder()
        .setColor("Random")
        .setTitle(c.display)
        .setThumbnail(c.image)
        .addFields(
            { name: "Threat Level", value: label, inline: false },
            { name: "Rarity Tier", value: tier, inline: true },
            { name: "Rarity Chance", value: `${rarityChance}%`, inline: true }
        );

    return interaction.reply({
        embeds: [embed],
        ephemeral: true
    });
};
