const activeSpawns = new Map();
const lastSpawnMap = new Map(); // ⭐ per‑guild cooldown map

// Randomized OPM‑style neutral spawn messages
const SPAWN_MESSAGES = [
    "⚠️ A mysterious presence has appeared…",
    "⚠️ A powerful entity approaches!",
    "⚠️ Sensors detect an unknown presence nearby!",
    "⚠️ A strange figure emerges from the shadows…",
    "⚠️ A dangerous entity has entered the area!",
    "⚠️ A hostile presence is drawing near!",
    "⚠️ A threatening entity blocks your path!",
    "⚠️ A surge of power ripples through the air…",
    "⚠️ An unidentified lifeform has manifested!",
    "⚠️ A new presence challenges the Hero Association!",
    "⚠️ A new presence challenges the Monster Association!",
    "⚠️ A presence has arrived to the scene!"
];

function getRandomSpawnMessage() {
    return SPAWN_MESSAGES[Math.floor(Math.random() * SPAWN_MESSAGES.length)];
}

function setupSpawnSystem(
    client,
    characters,
    pickByRarity,
    activeSpawnsMap,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    getSpawnChannelId
) {
    client.on("messageCreate", async (message) => {
        if (message.author.bot) return;
        if (!message.guild) return;

        const guildId = message.guild.id;
        const spawnChannelId = getSpawnChannelId(guildId);
        if (!spawnChannelId) return;

        // Prevent overlapping spawns per guild
        if (activeSpawnsMap.has(guildId)) return;

        const now = Date.now();
        const lastSpawn = lastSpawnMap.get(guildId) || 0;

        // 15‑minute cooldown PER GUILD
        if (now - lastSpawn < 900000) return;

        // ⭐ LOCK IMMEDIATELY TO PREVENT MULTIPLE TIMERS
        activeSpawnsMap.set(guildId, { pending: true });

        // ⭐ WAIT 5 SECONDS BEFORE SPAWNING
        setTimeout(async () => {

            // If something spawned or was caught during delay, stop
            const pending = activeSpawnsMap.get(guildId);
            if (!pending || pending.caught || pending.fled) return;

            const character = pickByRarity(characters);

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId("catch_character")
                    .setLabel("Catch me!")
                    .setStyle(ButtonStyle.Primary)
            );

            const spawnMessage = getRandomSpawnMessage();
            const channel = message.guild.channels.cache.get(spawnChannelId);
            if (!channel) return;

            let sent;
            try {
                sent = await channel.send({
                    content: spawnMessage,
                    files: [character.image],
                    components: [row]
                });
            } catch (err) {
                console.error("Spawn failed:", err);
                activeSpawnsMap.delete(guildId); // unlock on failure
                return;
            }

            // Cooldown updates ONLY after successful spawn
            lastSpawnMap.set(guildId, Date.now());

            // Replace pending lock with real spawn data
            activeSpawnsMap.set(guildId, {
                character,
                messageId: sent.id,
                channelId: channel.id,
                caught: false,
                fled: false
            });

            // Flee timer (5 minutes)
            setTimeout(async () => {
                const spawn = activeSpawnsMap.get(guildId);
                if (!spawn || spawn.caught) return;

                spawn.fled = true;

                try {
                    const msg = await channel.messages.fetch(spawn.messageId);
                    const rowFled = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setCustomId("catch_character")
                            .setLabel("Fled")
                            .setStyle(ButtonStyle.Secondary)
                            .setDisabled(true)
                    );
                    await msg.edit({ components: [rowFled] });
                } catch {}

                activeSpawnsMap.delete(guildId);
            }, 5 * 60 * 1000);

        }, 5000); // ⭐ 5‑second delay
    });
}

module.exports = { setupSpawnSystem, activeSpawns };
