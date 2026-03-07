// util/saveInventory.js

const fs = require("fs");
const path = require("path");

// --------------------------------------
// PROJECT-LOCAL STORAGE PATHS (WORKS ON RAILWAY FREE TIER)
// --------------------------------------
const INVENTORY_PATH = path.join(__dirname, "..", "data", "inventory.json");
const BACKUP_PATH = path.join(__dirname, "..", "data", "inventory.json.bak");

// --------------------------------------
// SAFE JSON LOADER
// --------------------------------------
function loadJsonSafe(file) {
    try {
        const raw = fs.readFileSync(file, "utf8");
        if (!raw.trim()) return null;
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

// --------------------------------------
// LOAD INVENTORY WITH BACKUP RECOVERY
// --------------------------------------
let inventory = loadJsonSafe(INVENTORY_PATH);

// If corrupted or empty, try backup
if (!inventory || typeof inventory !== "object") {
    const backup = loadJsonSafe(BACKUP_PATH);
    if (backup && typeof backup === "object") {
        inventory = backup;
    } else {
        inventory = {};
    }
}

// --------------------------------------
// ALWAYS NORMALIZE INVENTORY TO ARRAYS
// --------------------------------------
for (const userId of Object.keys(inventory)) {
    const entry = inventory[userId];

    if (!Array.isArray(entry)) {
        if (entry && typeof entry === "object") {
            inventory[userId] = Object.values(entry);
        } else {
            inventory[userId] = [];
        }
    }
}

// --------------------------------------
// SAFE ATOMIC SAVE + BACKUP
// --------------------------------------
function saveInventory() {
    // Prevent catastrophic wipe
    if (!inventory || Object.keys(inventory).length === 0) {
        console.error("⚠ Refusing to save empty inventory — preventing data loss.");
        return;
    }

    const tmpPath = INVENTORY_PATH + ".tmp";

    // Write to temp file first
    fs.writeFileSync(tmpPath, JSON.stringify(inventory, null, 2));

    // Replace main file atomically
    fs.renameSync(tmpPath, INVENTORY_PATH);

    // Update backup
    fs.writeFileSync(BACKUP_PATH, JSON.stringify(inventory, null, 2));
}

// --------------------------------------
// IMPORT SYSTEMS
// --------------------------------------
const { characters } = require("../systems/characters");
const { rarityLabels, getNormalizedPercent, getRarityTier } = require("../systems/rarity");
const { stats } = require("../systems/stats");

// --------------------------------------
// SHORT ID GENERATOR
// --------------------------------------
function generateShortId() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let id = "";
    for (let i = 0; i < 6; i++) {
        id += chars[Math.floor(Math.random() * chars.length)];
    }
    return id;
}

// --------------------------------------
// RARITY KEY AUTO-FIX
// --------------------------------------
function fixRarityKey(r) {
    if (!r) return null;
    return r.replace(/-/g, "_");
}

// --------------------------------------
// CHARACTER LOOKUP HELPERS
// --------------------------------------
const slugToDisplay = new Map();
const displayToSlug = new Map();
const aliasToSlug = new Map();

for (const c of characters) {
    slugToDisplay.set(c.name, c.display);
    displayToSlug.set(c.display.toLowerCase(), c.name);

    for (const alias of c.aliases || []) {
        aliasToSlug.set(alias.toLowerCase(), c.name);
    }
}

function getSlugFromDisplayOrAlias(input) {
    if (!input) return null;
    const key = input.toLowerCase();
    return displayToSlug.get(key) || aliasToSlug.get(key) || null;
}

function getDisplayFromSlug(slug) {
    return slugToDisplay.get(slug) || slug;
}

// --------------------------------------
// CREATE FULL BALL OBJECT
// --------------------------------------
function createBallObject(character) {
    const rarityKey = fixRarityKey(character.rarity);
    const rarityPercent = getNormalizedPercent(rarityKey);
    const rarityTier = getRarityTier(rarityPercent);

    const threatStats = stats[character.name] || {
        power: 0,
        speed: 0,
        durability: 0,
        skill: 0,
        special: 0
    };

    return {
        id: generateShortId(),
        slug: character.name,
        display: character.display,
        rarity: rarityKey,
        rarityLabel: rarityLabels[rarityKey] || "Unknown rarity",
        rarityPercent,
        rarityTier,
        threat: character.threat,
        hp: character.hp,
        atk: character.atk,
        stats: {
            power: threatStats.power,
            speed: threatStats.speed,
            durability: threatStats.durability,
            skill: threatStats.skill,
            special: threatStats.special
        },
        image: character.image,
        caughtAt: Date.now()
    };
}

// --------------------------------------
// ADD BALL TO USER INVENTORY
// --------------------------------------
function addBallToInventory(userId, ball) {
    if (!inventory[userId]) inventory[userId] = [];

    if (!Array.isArray(inventory[userId])) {
        inventory[userId] = Object.values(inventory[userId]);
    }

    inventory[userId].push(ball);
    saveInventory();
}

// --------------------------------------
// GET USER INVENTORY
// --------------------------------------
function getUserInventory(userId) {
    const inv = inventory[userId];

    if (!inv) return [];

    if (!Array.isArray(inv)) {
        return Object.values(inv);
    }

    return inv;
}

// --------------------------------------
// CHECK IF USER OWNS A BALL BY ID
// --------------------------------------
function userHasBall(userId, ballId) {
    const inv = getUserInventory(userId);
    return inv.some(b => b.id === ballId);
}

// --------------------------------------
// TRANSFER BALL (BY ID)
// --------------------------------------
function transferBall(fromId, toId, ballId) {
    const fromInv = getUserInventory(fromId);
    const idx = fromInv.findIndex(b => b.id === ballId);
    if (idx === -1) return false;

    const ball = fromInv[idx];
    fromInv.splice(idx, 1);

    if (!inventory[toId]) inventory[toId] = [];
    if (!Array.isArray(inventory[toId])) {
        inventory[toId] = Object.values(inventory[toId]);
    }

    inventory[toId].push(ball);

    saveInventory();
    return true;
}

// --------------------------------------
// EXPORT
// --------------------------------------
module.exports = {
    createBallObject,
    addBallToInventory,
    getUserInventory,
    userHasBall,
    transferBall,
    getSlugFromDisplayOrAlias,
    getDisplayFromSlug
};
