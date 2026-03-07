// commands/completion.js

const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ComponentType,
    EmbedBuilder
} = require("discord.js");

const { buildCompletionPages } = require("../systems/opmGrid");
const { getUserInventory } = require("../util/saveInventory");

/**
 * Normalize inventory into: { slug: count }
 */
function normalizeInventory(raw) {
    const result = {};

    if (Array.isArray(raw)) {
        for (const entry of raw) {
            if (typeof entry === "string") {
                result[entry] = (result[entry] || 0) + 1;
            } else if (entry && typeof entry === "object") {
                if (entry.slug) {
                    result[entry.slug] = (result[entry.slug] || 0) + 1;
                } else if (entry.name) {
                    const slug = entry.name
                        .replace(/\s+/g, "")
                        .replace(/[()']/g, "")
                        .replace(/-/g, "_");
                    result[slug] = (result[slug] || 0) + 1;
                }
            }
        }
    } else if (raw && typeof raw === "object") {
        return raw;
    }

    return result;
}

// --------------------------------------
// EXECUTE HANDLER
// --------------------------------------
module.exports.execute = async function (interaction) {
    const sub = interaction.options.getSubcommand();
    if (sub !== "completion") {
        return interaction.reply({
            content: "Invalid subcommand.",
            ephemeral: true
        });
    }

    const targetUser = interaction.options.getUser("user") || interaction.user;
    const userId = targetUser.id;

    const rawInv = getUserInventory(userId);
    const userInv = normalizeInventory(rawInv);

    const userOwnedSlugs = Object.keys(userInv);

    const pages = buildCompletionPages(userOwnedSlugs);

    if (pages.length === 0) {
        return interaction.reply({
            content: `${targetUser} has no data in the OPMDex yet.`,
            ephemeral: true
        });
    }

    let index = 0;

    // --------------------------------------
    // MAKE EMBED (DBZDex-style layout)
    // --------------------------------------
    const makeEmbed = () => {
        const page = pages[index];
        const pageCount = pages.length;

        const header =
            `**${targetUser}**\n` +
            `opmdex progression: **${page.progression.toFixed(1)}%**`;

        const embed = new EmbedBuilder()
            .setColor("Random")
            .setDescription(header)
            .setFooter({ text: `Page ${index + 1}/${pageCount}` });

        // -----------------------------
        // OWNED SECTION — NO GAP
        // -----------------------------
        if (index === 0 && page.ownedLines.length > 0) {
            const ownedChunks = chunkLines(page.ownedLines);

            // First chunk directly under title
            embed.addFields({
                name: "**Owned characters**",
                value: ownedChunks[0]
            });

            // Remaining chunks
            for (let i = 1; i < ownedChunks.length; i++) {
                embed.addFields({
                    name: "\u200B",
                    value: ownedChunks[i]
                });
            }
        }

        // -----------------------------
        // MISSING SECTION — NO GAP
        // -----------------------------
        if (page.missingLines.length > 0) {
            const missingChunks = chunkLines(page.missingLines);

            // First chunk directly under title
            embed.addFields({
                name: "**Missing characters**",
                value: missingChunks[0]
            });

            // Remaining chunks
            for (let i = 1; i < missingChunks.length; i++) {
                embed.addFields({
                    name: "\u200B",
                    value: missingChunks[i]
                });
            }
        }

        return embed;
    };

    function chunkLines(lines) {
        const chunks = [];
        let current = "";

        for (const line of lines) {
            if ((current + line + "\n").length > 1024) {
                chunks.push(current);
                current = "";
            }
            current += line + "\n";
        }
        if (current.length > 0) chunks.push(current);

        return chunks;
    }

    // --------------------------------------
    // BUTTONS
    // --------------------------------------
    const backButton = new ButtonBuilder()
        .setCustomId("opmcompletion_back")
        .setLabel("Back")
        .setStyle(ButtonStyle.Secondary);

    const nextButton = new ButtonBuilder()
        .setCustomId("opmcompletion_next")
        .setLabel("Next")
        .setStyle(ButtonStyle.Secondary);

    const quitButton = new ButtonBuilder()
        .setCustomId("opmcompletion_quit")
        .setLabel("Quit")
        .setStyle(ButtonStyle.Danger);

    const makeRow = () => {
        return new ActionRowBuilder().addComponents(
            backButton.setDisabled(index === 0),
            nextButton.setDisabled(index === pages.length - 1),
            quitButton
        );
    };

    // --------------------------------------
    // SEND INITIAL MESSAGE
    // --------------------------------------
    const message = await interaction.reply({
        embeds: [makeEmbed()],
        components: [makeRow()],
        fetchReply: true
    });

    // --------------------------------------
    // COLLECTOR
    // --------------------------------------
    const collector = message.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: 120_000,
        filter: i => i.user.id === interaction.user.id
    });

    collector.on("collect", async i => {
        const id = i.customId;

        if (id === "opmcompletion_quit") {
            collector.stop("quit");
            return i.update({
                components: [
                    new ActionRowBuilder().addComponents(
                        backButton.setDisabled(true),
                        nextButton.setDisabled(true),
                        quitButton.setDisabled(true)
                    )
                ]
            });
        }

        if (id === "opmcompletion_back" && index > 0) index--;
        if (id === "opmcompletion_next" && index < pages.length - 1) index++;

        await i.update({
            embeds: [makeEmbed()],
            components: [makeRow()]
        });
    });

    collector.on("end", async (_, reason) => {
        if (reason !== "quit") {
            try {
                await message.edit({
                    components: [
                        new ActionRowBuilder().addComponents(
                            backButton.setDisabled(true),
                            nextButton.setDisabled(true),
                            quitButton.setDisabled(true)
                        )
                    ]
                });
            } catch {}
        }
    });
};

// --------------------------------------
// BUTTON HANDLER
// --------------------------------------
module.exports.buttonHandler = async function (interaction) {
    const id = interaction.customId;
    if (!id.startsWith("opmcompletion")) return;
};
