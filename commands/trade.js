// commands/trade.js

const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder
} = require("discord.js");

const {
    beginTrade,
    getTradeByUser,
    getTradeById,
    addToTrade,
    removeFromTrade,
    setLock,
    confirmTrade,
    cancelTradeByUser,
    TRADE_TIMEOUT
} = require("../systems/tradeStore");

const {
    getUserInventory,
    transferBall
} = require("../util/saveInventory");

// --------------------------------------
// RENDER TRADE VIEW
// --------------------------------------
function buildTradeView(trade) {
    const user1Offers = trade.offers[trade.user1]
        .map(id => {
            const inv = getUserInventory(trade.user1);
            const ball = inv.find(b => b.id === id);
            return ball ? `• ${ball.display} [#${ball.id}]` : "• (missing)";
        })
        .join("\n") || "_None_";

    const user2Offers = trade.offers[trade.user2]
        .map(id => {
            const inv = getUserInventory(trade.user2);
            const ball = inv.find(b => b.id === id);
            return ball ? `• ${ball.display} [#${ball.id}]` : "• (missing)";
        })
        .join("\n") || "_None_";

    const embed = new EmbedBuilder()
        .setColor("Random")
        .setTitle("Trade Session")
        .setDescription(
            `Trade between <@${trade.user1}> and <@${trade.user2}>\n` +
            `Timeout: ${Math.floor(TRADE_TIMEOUT / 60000)} minutes of inactivity`
        )
        .addFields(
            {
                name: `Offers from <@${trade.user1}>` +
                    (trade.locked[trade.user1] ? " 🔒" : ""),
                value: user1Offers
            },
            {
                name: `Offers from <@${trade.user2}>` +
                    (trade.locked[trade.user2] ? " 🔒" : ""),
                value: user2Offers
            },
            {
                name: "Status",
                value:
                    `• <@${trade.user1}>: ` +
                    `${trade.locked[trade.user1] ? "🔒" : "🔓"} ` +
                    `${trade.confirmed[trade.user1] ? "✅" : (trade.locked[trade.user1] ? "⏳" : "")}\n` +
                    `• <@${trade.user2}>: ` +
                    `${trade.locked[trade.user2] ? "🔒" : "🔓"} ` +
                    `${trade.confirmed[trade.user2] ? "✅" : (trade.locked[trade.user2] ? "⏳" : "")}`
            }
        );

    const bothLocked = trade.locked[trade.user1] && trade.locked[trade.user2];

    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId(`trade_lock_${trade.id}`)
            .setLabel("Lock/Unlock")
            .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
            .setCustomId(`trade_confirm_${trade.id}`)
            .setLabel("Confirm")
            .setStyle(ButtonStyle.Success)
            .setDisabled(!bothLocked),
        new ButtonBuilder()
            .setCustomId(`trade_cancel_${trade.id}`)
            .setLabel("Cancel")
            .setStyle(ButtonStyle.Danger)
    );

    return { embed, row };
}

// --------------------------------------
// MAIN EXECUTE HANDLER (called by opm.js)
// --------------------------------------
module.exports.execute = async function (interaction) {
    const sub = interaction.options.getSubcommand();

    if (sub === "start") {
        const other = interaction.options.getUser("user", true);

        if (other.id === interaction.user.id) {
            return interaction.reply({
                content: "You can't trade with yourself.",
                ephemeral: true
            });
        }

        if (other.bot) {
            return interaction.reply({
                content: "You cannot trade with bots.",
                ephemeral: true
            });
        }

        const existing =
            getTradeByUser(interaction.user.id) ||
            getTradeByUser(other.id);

        if (existing) {
            return interaction.reply({
                content: "One of you is already in a trade.",
                ephemeral: true
            });
        }

        const { embed, row } = buildTradeView({
            user1: interaction.user.id,
            user2: other.id,
            offers: { [interaction.user.id]: [], [other.id]: [] },
            locked: { [interaction.user.id]: false, [other.id]: false },
            confirmed: { [interaction.user.id]: false, [other.id]: false }
        });

        const msg = await interaction.reply({
            content:
                `Trade started with ${other}.\n` +
                `Use **/opm trade add** and **/opm trade remove** to manage your offer.\n` +
                `Then use the buttons to lock and confirm.`,
            embeds: [embed],
            components: [row],
            fetchReply: true
        });

        beginTrade(interaction.user.id, other.id, msg.id);
        return;
    }

    if (sub === "add") {
        const trade = getTradeByUser(interaction.user.id);
        if (!trade) {
            return interaction.reply({
                content: "You are not currently in a trade.",
                ephemeral: true
            });
        }

        if (trade.locked[interaction.user.id]) {
            return interaction.reply({
                content: "You have locked your offer. Unlock it before adding characters.",
                ephemeral: true
            });
        }

        const input = interaction.options.getString("character", true);
        const inv = getUserInventory(interaction.user.id);

        let ball =
            inv.find(b => b.id === input) ||
            inv.find(b => b.display.toLowerCase() === input.toLowerCase());

        if (!ball) {
            return interaction.reply({
                content: "You don't own that character.",
                ephemeral: true
            });
        }

        addToTrade(interaction.user.id, ball.id);

        const updated = getTradeById(trade.id);
        if (!updated) {
            return interaction.reply({
                content: "This trade session expired.",
                ephemeral: true
            });
        }

        const { embed, row } = buildTradeView(updated);

        try {
            const msg = await interaction.channel.messages.fetch(updated.messageId);
            await msg.edit({ embeds: [embed], components: [row] });
        } catch {}

        return interaction.reply({
            content: `Added **${ball.display} [#${ball.id}]** to your trade offer.`,
            ephemeral: true
        });
    }

    if (sub === "remove") {
        const trade = getTradeByUser(interaction.user.id);
        if (!trade) {
            return interaction.reply({
                content: "You are not currently in a trade.",
                ephemeral: true
            });
        }

        if (trade.locked[interaction.user.id]) {
            return interaction.reply({
                content: "You have locked your offer. Unlock it before removing characters.",
                ephemeral: true
            });
        }

        const id = interaction.options.getString("character", true);
        const myOffers = trade.offers[interaction.user.id];

        if (!myOffers.includes(id)) {
            return interaction.reply({
                content: "That character is not in your current trade offer.",
                ephemeral: true
            });
        }

        removeFromTrade(interaction.user.id, id);

        const updated = getTradeById(trade.id);
        if (!updated) {
            return interaction.reply({
                content: "This trade session expired.",
                ephemeral: true
            });
        }

        const { embed, row } = buildTradeView(updated);

        try {
            const msg = await interaction.channel.messages.fetch(updated.messageId);
            await msg.edit({ embeds: [embed], components: [row] });
        } catch {}

        return interaction.reply({
            content: `Removed **[#${id}]** from your trade offer.`,
            ephemeral: true
        });
    }

    if (sub === "view") {
        const trade = getTradeByUser(interaction.user.id);
        if (!trade) {
            return interaction.reply({
                content: "You are not currently in a trade.",
                ephemeral: true
            });
        }

        const { embed, row } = buildTradeView(trade);
        return interaction.reply({
            embeds: [embed],
            components: [row],
            ephemeral: true
        });
    }

    if (sub === "cancel") {
        const ok = cancelTradeByUser(interaction.user.id);
        if (!ok) {
            return interaction.reply({
                content: "You are not currently in a trade.",
                ephemeral: true
            });
        }

        return interaction.reply({
            content: "Trade cancelled.",
            ephemeral: true
        });
    }
};

// --------------------------------------
// AUTOCOMPLETE HANDLER
// --------------------------------------
module.exports.autocomplete = async function (interaction) {
    const sub = interaction.options.getSubcommand(false);
    const focused = interaction.options.getFocused(true);
    const userId = interaction.user.id;

    if (focused.name !== "character") {
        return interaction.respond([]);
    }

    const query = focused.value.toLowerCase();
    const inv = getUserInventory(userId) || [];

    const safe = inv.filter(b => b && b.display && b.id);

    if (sub === "add") {
        const trade = getTradeByUser(userId);
        const offered = trade ? new Set(trade.offers[userId]) : new Set();

        const choices = safe
            .filter(b => !offered.has(b.id))
            .filter(b =>
                b.display.toLowerCase().includes(query) ||
                b.id.toLowerCase().includes(query)
            )
            .slice(0, 25)
            .map(b => ({
                name: `${b.display} [#${b.id}]`,
                value: b.id
            }));

        return interaction.respond(choices);
    }

    if (sub === "remove") {
        const trade = getTradeByUser(userId);
        if (!trade) return interaction.respond([]);

        const offeredIds = trade.offers[userId];

        const choices = offeredIds
            .map(id => safe.find(b => b.id === id))
            .filter(Boolean)
            .filter(b =>
                b.display.toLowerCase().includes(query) ||
                b.id.toLowerCase().includes(query)
            )
            .slice(0, 25)
            .map(b => ({
                name: `${b.display} [#${b.id}]`,
                value: b.id
            }));

        return interaction.respond(choices);
    }

    return interaction.respond([]);
};

// --------------------------------------
// BUTTON HANDLER
// --------------------------------------
module.exports.buttonHandler = async function (interaction) {
    const id = interaction.customId;

    if (!id.startsWith("trade_")) return;

    const parts = id.split("_");
    const action = parts[1];
    const tradeId = parts.slice(2).join("_");

    const trade = getTradeById(tradeId);
    if (!trade) {
        return interaction.reply({
            content: "This trade session no longer exists or has expired.",
            ephemeral: true
        });
    }

    const userId = interaction.user.id;
    if (userId !== trade.user1 && userId !== trade.user2) {
        return interaction.reply({
            content: "You are not part of this trade.",
            ephemeral: true
        });
    }

    if (action === "lock") {
        const currentlyLocked = trade.locked[userId];
        setLock(userId, !currentlyLocked);

        const updated = getTradeById(tradeId);
        if (!updated) {
            return interaction.reply({
                content: "This trade session expired.",
                ephemeral: true
            });
        }

        const { embed, row } = buildTradeView(updated);

        return interaction.update({
            embeds: [embed],
            components: [row]
        });
    }

    if (action === "confirm") {
        const result = confirmTrade(userId);
        if (!result) {
            return interaction.reply({
                content: "This trade session no longer exists.",
                ephemeral: true
            });
        }

        const { trade: updated, ready } = result;

        if (!ready) {
            const { embed, row } = buildTradeView(updated);
            return interaction.update({
                embeds: [embed],
                components: [row]
            });
        }

        const user1Inv = getUserInventory(updated.user1);
        const user2Inv = getUserInventory(updated.user2);

        for (const id of updated.offers[updated.user1]) {
            if (!user1Inv.some(b => b.id === id)) {
                return interaction.reply({
                    content: "Trade failed: one of your characters is no longer available.",
                    ephemeral: true
                });
            }
        }

        for (const id of updated.offers[updated.user2]) {
            if (!user2Inv.some(b => b.id === id)) {
                return interaction.reply({
                    content: "Trade failed: one of the other user's characters is no longer available.",
                    ephemeral: true
                });
            }
        }

        for (const id of updated.offers[updated.user1]) {
            transferBall(updated.user1, updated.user2, id);
        }
        for (const id of updated.offers[updated.user2]) {
            transferBall(updated.user2, updated.user1, id);
        }

        cancelTradeByUser(updated.user1);

        return interaction.update({
            content: "Trade completed successfully!",
            embeds: [],
            components: []
        });
    }

    if (action === "cancel") {
        cancelTradeByUser(userId);

        return interaction.update({
            content: "Trade cancelled.",
            embeds: [],
            components: []
        });
    }
};
