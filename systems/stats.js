// systems/stats.js

const { characters } = require("./characters");

const stats = {};

function baseByThreat(threat) {
    switch (threat) {
        case "Wolf":
            return { p: 80, s: 80, d: 80, sk: 60, sp: 60 };
        case "Tiger":
            return { p: 200, s: 180, d: 170, sk: 120, sp: 110 };
        case "Demon":
            return { p: 500, s: 450, d: 430, sk: 300, sp: 280 };
        case "Dragon":
            return { p: 1200, s: 1100, d: 1000, sk: 700, sp: 650 };
        case "God":
            return { p: 4000, s: 3800, d: 3600, sk: 1500, sp: 2000 };
        default:
            return { p: 100, s: 100, d: 100, sk: 100, sp: 100 };
    }
}

for (const c of characters) {
    const b = baseByThreat(c.threat);
    stats[c.name] = {
        power: b.p,
        speed: b.s,
        durability: b.d,
        skill: b.sk,
        special: b.sp
    };
}

module.exports = { stats };
