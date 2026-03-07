// commands/give.js

const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const {
    getUserInventory,
    transferBall
} = require("../util/saveInventory");

// --------------------------------------
// AUTOCOMPLETE HANDLER
// --------------------------------------
module.exports.autocomplete = async function (interaction) {
    const sub = interaction.options.getSubcommand(false);
    if (sub !== "give") return;

    const focused = interaction.options.getFocused().toLowerCase();
    const inv = getUserInventory(interaction.user.id) || [];

    const safe = inv.filter(b => b && b.display && b.id);

    const list = safe
        .filter(b =>
            b.display.toLowerCase().includes(focused) ||
            b.id.toLowerCase().includes(focused)
        )
        .slice(0, 25)
        .map(b => ({
            name: `${b.display} [#${b.id}]`,
            value: b.id
        }));

    return interaction.respond(list);
};

// --------------------------------------
// EXECUTE HANDLER (called by opm.js)
// --------------------------------------
module.exports.execute = async function (interaction) {
    const sub = interaction.options.getSubcommand();
    if (sub !== "give") {
        return interaction.reply({
            content: "Invalid subcommand.",
            ephemeral: true
        });
    }

    const giver = interaction.user;
    const target = interaction.options.getUser("user", true);
    const id = interaction.options.getString("character", true);

    if (target.bot) {
        return interaction.reply({
            content: "❌ You cannot give characters to bots.",
            ephemeral: true
        });
    }

    const inv = getUserInventory(giver.id);
    const ball = inv.find(b => b.id === id);

    if (!ball) {
        return interaction.reply({
            content: "❌ You don't own that character.",
            ephemeral: true
        });
    }

    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId(`give|accept|${giver.id}|${id}`)
            .setLabel("Accept")
            .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
            .setCustomId(`give|decline|${giver.id}|${id}`)
            .setLabel("Decline")
            .setStyle(ButtonStyle.Danger)
    );

    return interaction.reply({
        content: `${target}, do you accept **${ball.display} [#${ball.id}]** from ${giver}?`,
        components: [row]
    });
};

// --------------------------------------
// BUTTON HANDLER
// --------------------------------------
module.exports.button = async function (interaction) {
    const [prefix, action, giverId, id] = interaction.customId.split("|");
    if (prefix !== "give") return;

    const giver = await interaction.client.users.fetch(giverId);

    if (interaction.user.id === giverId) {
        return interaction.reply({
            content: "❌ You cannot accept your own gift.",
            ephemeral: true
        });
    }

    const disabledRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("give_disabled_accept")
            .setLabel("Accept")
            .setStyle(ButtonStyle.Success)
            .setDisabled(true),
        new ButtonBuilder()
            .setCustomId("give_disabled_decline")
            .setLabel("Decline")
            .setStyle(ButtonStyle.Danger)
            .setDisabled(true)
    );

    try {
        await interaction.update({
            components: [disabledRow]
        });
    } catch {}

    const giverInv = getUserInventory(giverId);
    const ball = giverInv.find(b => b.id === id);

    if (!ball) {
        return interaction.followUp({
            content: "❌ Transfer failed — the giver no longer owns this character.",
            ephemeral: true
        });
    }

    if (action === "accept") {
        const ok = transferBall(giverId, interaction.user.id, id);

        if (!ok) {
            return interaction.followUp({
                content: "❌ Transfer failed.",
                ephemeral: true
            });
        }

        return interaction.followUp(
            `🎉 ${interaction.user} accepted **${ball.display} [#${ball.id}]** from ${giver}!`
        );
    }

    if (action === "decline") {
        return interaction.followUp(
            `❌ ${interaction.user} declined the gift from ${giver}.`
        );
    }
};
