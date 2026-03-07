// commands/battle.js

const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder
} = require("discord.js");

const {
    beginBattle,
    getBattleByUser,
    getBattleById,
    addToDeck,
    removeFromDeck,
    toggleReady,
    cancelBattleByUser,
    deleteBattle,
    runBattle
} = require("../systems/battleSystem");

const {
    getUserInventory
} = require("../util/saveInventory");

// --------------------------------------
// BUILD BATTLE PLAN EMBED
// --------------------------------------
function buildBattlePlanEmbed(battle) {
    const u1 = battle.user1;
    const u2 = battle.user2;

    const user1Deck = battle.decks[u1]
        .map(id => {
            const inv = getUserInventory(u1);
            const ball = inv.find(b => b.id === id);
            return ball ? `• ${ball.display} [#${ball.id}]` : "• (missing)";
        })
        .join("\n") || "_Empty_";

    const user2Deck = battle.decks[u2]
        .map(id => {
            const inv = getUserInventory(u2);
            const ball = inv.find(b => b.id === id);
            return ball ? `• ${ball.display} [#${ball.id}]` : "• (missing)";
        })
        .join("\n") || "_Empty_";

    const embed = new EmbedBuilder()
        .setColor("Random")
        .setTitle("Characters Battle Plan")
        .setDescription(
            `Battle between <@${u1}> and <@${u2}>\n` +
            `Add or remove characters using **/opm battle add** and **/opm battle remove**.\n` +
            `Max per player: **5**.\n` +
            `When you're ready, press **Ready**.`
        )
        .addFields(
            {
                name: `${battle.ready[u1] ? "✅" : "⏳"} <@${u1}>'s deck`,
                value: user1Deck
            },
            {
                name: `${battle.ready[u2] ? "✅" : "⏳"} <@${u2}>'s deck`,
                value: user2Deck
            }
        );

    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId(`battle|ready|${battle.id}`)
            .setLabel("Ready")
            .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
            .setCustomId(`battle|cancel|${battle.id}`)
            .setLabel("Cancel")
            .setStyle(ButtonStyle.Danger)
    );

    return { embed, row };
}

// --------------------------------------
// BUILD RESULT EMBED
// --------------------------------------
function buildResultEmbed(battle, result) {
    const { side1, side2, logLines, winner } = result;

    function summarizeSide(side) {
        if (!side.length) return "_No characters_";
        return side
            .map(c => {
                return `• ${c.name} [#${c.id}] (HP: ${c.hp}/${c.maxHp}, ATK: ${c.atk}, Threat: ${c.threat})`;
            })
            .join("\n");
    }

    const summary1 = summarizeSide(side1);
    const summary2 = summarizeSide(side2);

    const embed = new EmbedBuilder()
        .setColor("Random")
        .setTitle("Battle Result")
        .setDescription(
            `Battle between <@${battle.user1}> and <@${battle.user2}>`
        )
        .addFields(
            {
                name: `Final Team - <@${battle.user1}>`,
                value: summary1
            },
            {
                name: `Final Team - <@${battle.user2}>`,
                value: summary2
            },
            {
                name: "Battle Log",
                value: logLines.join("\n").slice(0, 4000) || "_No events?_"
            }
        );

    if (winner) {
        embed.setFooter({ text: `Winner: ${winner === battle.user1 ? "Player 1" : "Player 2"}` });
    } else {
        embed.setFooter({ text: "Result: Draw" });
    }

    return embed;
}

// --------------------------------------
// MAIN EXECUTE HANDLER (called by opm.js)
// --------------------------------------
module.exports.execute = async function (interaction) {
    const sub = interaction.options.getSubcommand();

    // --------------------------------------
    // /opm battle start
    // --------------------------------------
    if (sub === "start") {
        const other = interaction.options.getUser("user", true);

        if (other.id === interaction.user.id) {
            return interaction.reply({
                content: "You can't battle yourself.",
                ephemeral: true
            });
        }

        if (other.bot) {
            return interaction.reply({
                content: "You cannot battle bots.",
                ephemeral: true
            });
        }

        const existing =
            getBattleByUser(interaction.user.id) ||
            getBattleByUser(other.id);

        if (existing) {
            return interaction.reply({
                content: "One of you is already in a battle.",
                ephemeral: true
            });
        }

        const msg = await interaction.channel.send({
            content: `Hey ${other}, <@${interaction.user.id}> is proposing a battle with you!`
        });

        await interaction.reply({
            content: "Battle request sent!",
            ephemeral: true
        });

        const battle = beginBattle(
            interaction.user.id,
            other.id,
            msg.id,
            msg.channel.id
        );

        const { embed, row } = buildBattlePlanEmbed(battle);

        await msg.edit({
            content: `Hey ${other}, <@${interaction.user.id}> is proposing a battle with you!`,
            embeds: [embed],
            components: [row]
        });

        return;
    }

    // --------------------------------------
    // /opm battle add
    // --------------------------------------
    if (sub === "add") {
        const battle = getBattleByUser(interaction.user.id);
        if (!battle) {
            return interaction.reply({
                content: "You are not currently in a battle.",
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

        const deck = battle.decks[interaction.user.id];
        if (deck.includes(ball.id)) {
            return interaction.reply({
                content: "That character is already in your battle deck.",
                ephemeral: true
            });
        }

        if (deck.length >= 5) {
            return interaction.reply({
                content: "You already have the maximum of 5 characters in your deck.",
                ephemeral: true
            });
        }

        addToDeck(interaction.user.id, ball.id);

        const updated = getBattleById(battle.id);
        if (!updated) {
            return interaction.reply({
                content: "This battle session expired.",
                ephemeral: true
            });
        }

        const { embed, row } = buildBattlePlanEmbed(updated);

        try {
            const channel = await interaction.client.channels.fetch(updated.channelId);
            const msg = await channel.messages.fetch(updated.messageId);
            await msg.edit({ embeds: [embed], components: [row] });
        } catch {}

        return interaction.reply({
            content: `Added **${ball.display} [#${ball.id}]** to your battle deck.`,
            ephemeral: true
        });
    }

    // --------------------------------------
    // /opm battle remove
    // --------------------------------------
    if (sub === "remove") {
        const battle = getBattleByUser(interaction.user.id);
        if (!battle) {
            return interaction.reply({
                content: "You are not currently in a battle.",
                ephemeral: true
            });
        }

        const id = interaction.options.getString("character", true);
        const deck = battle.decks[interaction.user.id];

        if (!deck.includes(id)) {
            return interaction.reply({
                content: "That character is not in your battle deck.",
                ephemeral: true
            });
        }

        removeFromDeck(interaction.user.id, id);

        const updated = getBattleById(battle.id);
        if (!updated) {
            return interaction.reply({
                content: "This battle session expired.",
                ephemeral: true
            });
        }

        const { embed, row } = buildBattlePlanEmbed(updated);

        try {
            const channel = await interaction.client.channels.fetch(updated.channelId);
            const msg = await channel.messages.fetch(updated.messageId);
            await msg.edit({ embeds: [embed], components: [row] });
        } catch {}

        return interaction.reply({
            content: `Removed **[#${id}]** from your battle deck.`,
            ephemeral: true
        });
    }

    // --------------------------------------
    // /opm battle cancel
    // --------------------------------------
    if (sub === "cancel") {
        const battle = cancelBattleByUser(interaction.user.id);
        if (!battle) {
            return interaction.reply({
                content: "You are not currently in a battle.",
                ephemeral: true
            });
        }

        try {
            const channel = await interaction.client.channels.fetch(battle.channelId);
            const msg = await channel.messages.fetch(battle.messageId);
            await msg.edit({
                content: "❌ Battle cancelled.",
                embeds: [],
                components: []
            });
        } catch {}

        return interaction.reply({
            content: "Battle cancelled for both players.",
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
        const battle = getBattleByUser(userId);
        const offered = battle ? new Set(battle.decks[userId]) : new Set();

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
        const battle = getBattleByUser(userId);
        if (!battle) return interaction.respond([]);

        const deckIds = battle.decks[userId];

        const choices = deckIds
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
module.exports.button = async function (interaction) {
    const id = interaction.customId;

    if (!id.startsWith("battle|")) return;

    const parts = id.split("|");
    const action = parts[1];
    const battleId = parts[2];

    const battle = getBattleById(battleId);
    if (!battle) {
        return interaction.reply({
            content: "This battle session no longer exists or has expired.",
            ephemeral: true
        });
    }

    const userId = interaction.user.id;
    if (userId !== battle.user1 && userId !== battle.user2) {
        return interaction.reply({
            content: "You are not part of this battle.",
            ephemeral: true
        });
    }

    // CANCEL
    if (action === "cancel") {
        deleteBattle(battle.id);

        return interaction.update({
            content: "❌ Battle cancelled.",
            embeds: [],
            components: []
        });
    }

    // READY
    if (action === "ready") {
        toggleReady(userId);

        const updated = getBattleById(battle.id);
        if (!updated) {
            return interaction.reply({
                content: "This battle session expired.",
                ephemeral: true
            });
        }

        const bothReady =
            updated.ready[updated.user1] &&
            updated.ready[updated.user2];

        const user1HasChars = updated.decks[updated.user1].length > 0;
        const user2HasChars = updated.decks[updated.user2].length > 0;

        if (bothReady && user1HasChars && user2HasChars) {
            const result = runBattle(updated);
            const embed = buildResultEmbed(updated, result);

            deleteBattle(updated.id);

            const logText = result.logLines.join("\n");

            return interaction.update({
                content: logText,
                embeds: [embed],
                components: []
            });
        }

        const { embed, row } = buildBattlePlanEmbed(updated);

        return interaction.update({
            embeds: [embed],
            components: [row]
        });
    }
};
