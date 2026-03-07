// commands/config.js

const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    ChannelType,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder
} = require("discord.js");

const {
    setSpawnChannelId,
    setAcceptedTOS,
    getAcceptedTOS,
    setSpawningDisabled,
    getSpawningDisabled,
    getSpawnChannelId
} = require("../util/configStore");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("config")
        .setDescription("Configure the bot")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)

        .addSubcommand(sub =>
            sub.setName("channel")
                .setDescription("Set or change the channel where characters will spawn.")
                .addChannelOption(opt =>
                    opt.setName("channel")
                        .setDescription("Channel where characters will spawn")
                        .addChannelTypes(ChannelType.GuildText)
                        .setRequired(true)
                )
        )

        .addSubcommand(sub =>
            sub.setName("disable")
                .setDescription("Disable or enable characters spawning.")
                .addBooleanOption(opt =>
                    opt.setName("value")
                        .setDescription("True = disable spawning, False = enable spawning")
                        .setRequired(true)
                )
        )

        .addSubcommand(sub =>
            sub.setName("status")
                .setDescription("Check the server configuration status.")
        ),

    async execute(interaction) {
        const guildId = interaction.guild.id;
        const sub = interaction.options.getSubcommand();

        // --------------------------------------
        // TOS CHECK (applies to ALL config actions)
        // --------------------------------------
        const accepted = getAcceptedTOS(guildId);

        if (!accepted) {
            const embed = new EmbedBuilder()
                .setTitle("OnePunchManDex Activation")
                .setDescription(
                    "To enable the bot in this server, you must read and accept the **Terms of Service**.\n\n" +
                    "Summary of rules:\n" +
                    "• No farming (spamming or creating servers for characters)\n" +
                    "• Selling or exchanging characters for money or goods is forbidden\n" +
                    "• Do not attempt to abuse or exploit the bot\n\n"
                )
                .setColor("#ffcc00");

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId("tos_accept")
                    .setLabel("Accept")
                    .setStyle(ButtonStyle.Success),

                new ButtonBuilder()
                    .setLabel("Terms of Service")
                    .setStyle(ButtonStyle.Link)
                    .setURL("https://github.com/CrashHelmet/OPMDex-TOS-PP/blob/main/OPMDex%20TOS%20%26%20PP#one-punch-man-dex--terms-of-service"),

                new ButtonBuilder()
                    .setLabel("Privacy Policy")
                    .setStyle(ButtonStyle.Link)
                    .setURL("https://github.com/CrashHelmet/OPMDex-TOS-PP/blob/main/OPMDex%20TOS%20%26%20PP#one-punch-man-dex--privacy-policy")
            );

            return interaction.reply({
                content: "Before configuring the bot, you must accept the Terms of Service.",
                embeds: [embed],
                components: [row],
                ephemeral: true
            });
        }

        // --------------------------------------
        // /config channel
        // --------------------------------------
        if (sub === "channel") {
            const channel = interaction.options.getChannel("channel", true);

            setSpawnChannelId(guildId, channel.id);

            return interaction.reply({
                content: `Spawn channel set to ${channel}.`,
                ephemeral: true
            });
        }

        // --------------------------------------
        // /config disable
        // --------------------------------------
        if (sub === "disable") {
            const value = interaction.options.getBoolean("value", true);

            setSpawningDisabled(guildId, value);

            return interaction.reply({
                content: value
                    ? "Character spawning has been **disabled**."
                    : "Character spawning has been **enabled**.",
                ephemeral: true
            });
        }

        // --------------------------------------
        // /config status
        // --------------------------------------
        if (sub === "status") {
            const channelId = getSpawnChannelId(guildId);
            const disabled = getSpawningDisabled(guildId);

            return interaction.reply({
                content:
                    `**OnePunchManDex is configured in this server.**\n\n` +
                    `**Spawn channel:** ${channelId ? `<#${channelId}>` : "Not set"}\n` +
                    `**Status:** ${disabled ? "Disabled" : "Enabled"}`,
                ephemeral: true
            });
        }
    }
};
