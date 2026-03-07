// systems/rarity.js

// -------------------------------
// 1. RAW WEIGHTS (with new "above" tier)
// -------------------------------
const rarityWeights = {
    // WOLF
    very_low_wolf: 100,
    low_wolf: 98,
    wolf: 96,
    high_wolf: 94,
    very_high_wolf: 92,
    above_wolf: 85,

    // TIGER
    very_low_tiger: 80,
    low_tiger: 78,
    tiger: 76,
    high_tiger: 74,
    very_high_tiger: 74,
    above_tiger: 65,

    // DEMON
    very_low_demon: 45,
    low_demon: 43,
    demon: 41,
    high_demon: 39,
    very_high_demon: 37,
    above_demon: 30,

    // DRAGON
    very_low_dragon: 26,
    low_dragon: 20,
    dragon: 14,
    high_dragon: 8,
    very_high_dragon: 1,
    above_dragon: 0.5,

    // GOD
    very_low_god: 0.3,
    low_god: 0.2,
    god: 0.1,
    high_god: 0.07,
    very_high_god: 0.05,
    above_god: 0.01
};

// -------------------------------
// 2. READABLE LABELS
// -------------------------------
const rarityLabels = {
    very_low_wolf: "Very-low Wolf level threat",
    low_wolf: "Low Wolf level threat",
    wolf: "Wolf level threat",
    high_wolf: "High Wolf level threat",
    very_high_wolf: "Very-high Wolf level threat",
    above_wolf: "Above Wolf level threat",

    very_low_tiger: "Very-low Tiger level threat",
    low_tiger: "Low Tiger level threat",
    tiger: "Tiger level threat",
    high_tiger: "High Tiger level threat",
    very_high_tiger: "Very-high Tiger level threat",
    above_tiger: "Above Tiger level threat",

    very_low_demon: "Very-low Demon level threat",
    low_demon: "Low Demon level threat",
    demon: "Demon level threat",
    high_demon: "High Demon level threat",
    very_high_demon: "Very-high Demon level threat",
    above_demon: "Above Demon level threat",

    very_low_dragon: "Very-low Dragon level threat",
    low_dragon: "Low Dragon level threat",
    dragon: "Dragon level threat",
    high_dragon: "High Dragon level threat",
    very_high_dragon: "Very-high Dragon level threat",
    above_dragon: "Above Dragon level threat",

    very_low_god: "Very-low God level threat",
    low_god: "Low God level threat",
    god: "God level threat",
    high_god: "High God level threat",
    very_high_god: "Very-high God level threat",
    above_god: "Above God level threat"
};

// -------------------------------
// 3. NORMALIZATION BASELINE
// -------------------------------
const BASELINE = rarityWeights["very_low_wolf"];

// -------------------------------
// 4. NORMALIZED PERCENTAGE (UI only)
// -------------------------------
function getNormalizedPercent(rarityKey) {
    const weight = rarityWeights[rarityKey] ?? 0;
    const percent = (weight / BASELINE) * 100;
    return Number(percent.toFixed(2));
}

// -------------------------------
// 5. TRUE SPAWN CHANCE (REAL probability)
// -------------------------------
function getTrueSpawnChance(rarityKey) {
    const weight = rarityWeights[rarityKey] ?? 0;

    const total = Object.values(rarityWeights)
        .reduce((a, b) => a + b, 0);

    const percent = (weight / total) * 100;

    return Number(percent.toFixed(5));
}

// -------------------------------
// 6. BALANCED PERCENT (100 → 0.03 scale)
// -------------------------------
function getBalancedPercent(rarityKey) {
    const weight = rarityWeights[rarityKey] ?? 0;

    const max = Math.max(...Object.values(rarityWeights)); // 100
    const min = Math.min(...Object.values(rarityWeights)); // 0.01

    const scaled =
        ((weight - min) / (max - min)) * (100 - 0.01) + 0.01;

    return Number(scaled.toFixed(2));
}

// -------------------------------
// 7. RARITY TIER
// -------------------------------
function getRarityTier(percent) {
    if (percent >= 85) return "Common Threat";
    if (percent >= 65) return "Uncommon Threat";
    if (percent >= 30) return "Rare Threat";
    if (percent >= 1) return "Super Rare Threat";
    if (percent >= 0.01) return "Ultra Rare Threat";
    return "Mythic Threat";
}

// -------------------------------
// 8. PICK BY RARITY
// -------------------------------
function pickByRarity(characters) {
    let total = 0;
    const weighted = [];

    for (const c of characters) {
        const w = rarityWeights[c.rarity] ?? 10;
        total += w;
        weighted.push({ c, w });
    }

    const roll = Math.random() * total;
    let acc = 0;

    for (const { c, w } of weighted) {
        acc += w;
        if (roll <= acc) return c;
    }

    return characters[Math.floor(Math.random() * characters.length)];
}

// -------------------------------
// 9. EXPORT
// -------------------------------
module.exports = {
    rarityWeights,
    rarityLabels,
    getNormalizedPercent,
    getTrueSpawnChance,
    getBalancedPercent,
    getRarityTier,
    pickByRarity
};
