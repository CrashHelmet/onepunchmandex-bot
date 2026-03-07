// util/configStore.js

const fs = require("fs");
const path = require("path");

const CONFIG_PATH = path.join(__dirname, "..", "config.json");

let config = { guilds: {} };

if (fs.existsSync(CONFIG_PATH)) {
    try {
        config = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
    } catch {
        config = { guilds: {} };
    }
}

function saveConfig() {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
}

// -----------------------------
// Spawn Channel
// -----------------------------
function setSpawnChannelId(guildId, channelId) {
    if (!config.guilds[guildId]) config.guilds[guildId] = {};
    config.guilds[guildId].spawnChannelId = channelId;
    saveConfig();
}

function getSpawnChannelId(guildId) {
    return config.guilds[guildId]?.spawnChannelId || null;
}

// -----------------------------
// TOS Acceptance
// -----------------------------
function setAcceptedTOS(guildId, value) {
    if (!config.guilds[guildId]) config.guilds[guildId] = {};
    config.guilds[guildId].acceptedTOS = value;
    saveConfig();
}

function getAcceptedTOS(guildId) {
    return config.guilds[guildId]?.acceptedTOS || false;
}

module.exports = {
    setSpawnChannelId,
    getSpawnChannelId,
    setAcceptedTOS,
    getAcceptedTOS
};
