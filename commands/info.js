// commands/info.js

const {
    ActionRowBuilder,
    StringSelectMenuBuilder,
    EmbedBuilder
} = require("discord.js");

const { getUserInventory } = require("../util/saveInventory");
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
    if (sub !== "info") return;

    const focused = interaction.options.getFocused().toLowerCase();
    const inv = getUserInventory(interaction.user.id) || [];

    const safe = inv.filter(b => b && b.display && b.id);

    const filtered = safe.filter(ball =>
        ball.display.toLowerCase().includes(focused) ||
        ball.id.toLowerCase().includes(focused)
    );

    const results = filtered.slice(0, 25).map(ball => ({
        name: `${ball.display} [#${ball.id}]`,
        value: ball.id
    }));

    return interaction.respond(results);
};

// --------------------------------------
// EXECUTE HANDLER (called by opm.js)
// --------------------------------------
module.exports.execute = async function (interaction) {
    const sub = interaction.options.getSubcommand();
    if (sub !== "info") {
        return interaction.reply({
            content: "Invalid subcommand.",
            ephemeral: true
        });
    }

    const selectedId = interaction.options.getString("character");
    const inv = getUserInventory(interaction.user.id) || [];

    if (!inv.length) {
        return interaction.reply({
            content: "You don't own any characters yet."
        });
    }

    if (selectedId) {
        const ball = inv.find(b => b.id === selectedId || b.slug === selectedId);
        if (!ball) {
            return interaction.reply({
                content: "❌ You don't own this character."
            });
        }

        return sendCharacterCard(interaction, ball);
    }

    const options = inv
        .filter(b => b && b.display && b.id)
        .map(ball => ({
            label: `${ball.display} [#${ball.id}]`,
            value: ball.id
        }));

    const menu = new StringSelectMenuBuilder()
        .setCustomId("opm_info_select")
        .setPlaceholder("Select a character")
        .addOptions(options.slice(0, 25));

    const row = new ActionRowBuilder().addComponents(menu);

    return interaction.reply({
        content: "Choose a character:",
        components: [row]
    });
};

// --------------------------------------
// SELECT MENU HANDLER
// --------------------------------------
module.exports.selectHandler = async function (interaction) {
    const id = interaction.values[0];
    const inv = getUserInventory(interaction.user.id);
    const ball = inv.find(b => b.id === id);

    if (!ball) {
        return interaction.reply({
            content: "❌ Character not found in your inventory."
        });
    }

    return sendCharacterCard(interaction, ball);
};

// --------------------------------------
// CHARACTER CARD BUILDER
// --------------------------------------
function sendCharacterCard(interaction, ball) {
    const percent = getBalancedPercent(ball.rarity);
    const tier = getRarityTier(percent);
    const label = rarityLabels[ball.rarity];

    const embed = new EmbedBuilder()
        .setTitle(`${ball.display} — [#${ball.id}]`)
        .setImage(ball.image)
        .setColor("Random")
        .addFields(
            { name: "Threat Level", value: ball.threat || "Unknown", inline: true },
            { name: "Rarity", value: label, inline: true },
            { name: "Tier", value: tier, inline: true },
            { name: "Rarity %", value: `${percent}%`, inline: true },
            { name: "HP", value: String(ball.hp), inline: true },
            { name: "ATK", value: String(ball.atk), inline: true },
            {
                name: "Stats",
                value:
                    `Power: ${ball.stats.power}\n` +
                    `Speed: ${ball.stats.speed}\n` +
                    `Durability: ${ball.stats.durability}\n` +
                    `Skill: ${ball.stats.skill}\n` +
                    `Special: ${ball.stats.special}`,
                inline: false
            },
            {
                name: "Caught At",
                value: `<t:${Math.floor(ball.caughtAt / 1000)}:F>`,
                inline: false
            }
        );

    return interaction.reply({ embeds: [embed] });
}
