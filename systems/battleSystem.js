// systems/battleSystem.js

// Use inventory, not slugToCharacter
const { getUserInventory } = require("../util/saveInventory");

// In-memory battle store
const battles = new Map();

// Simple threat multipliers
const THREAT_MULTIPLIERS = {
    Wolf: 1.0,
    Tiger: 1.2,
    Demon: 1.5,
    Dragon: 2.0,
    God: 3.0
};

function makeBattleId(user1, user2) {
    return `${user1}:${user2}:${Date.now()}`;
}

function beginBattle(user1, user2, messageId, channelId) {
    const id = makeBattleId(user1, user2);
    const battle = {
        id,
        user1,
        user2,
        messageId,
        channelId,
        decks: {
            [user1]: [],
            [user2]: []
        },
        ready: {
            [user1]: false,
            [user2]: false
        },
        createdAt: Date.now()
    };
    battles.set(id, battle);
    return battle;
}

function getBattleById(id) {
    return battles.get(id) || null;
}

function getBattleByUser(userId) {
    for (const battle of battles.values()) {
        if (battle.user1 === userId || battle.user2 === userId) {
            return battle;
        }
    }
    return null;
}

// Now these store IDs, not slugs
function addToDeck(userId, id) {
    const battle = getBattleByUser(userId);
    if (!battle) return null;

    const deck = battle.decks[userId];
    if (!deck.includes(id) && deck.length < 5) {
        deck.push(id);
        battle.ready[userId] = false;
    }
    return battle;
}

function removeFromDeck(userId, id) {
    const battle = getBattleByUser(userId);
    if (!battle) return null;

    const deck = battle.decks[userId];
    const idx = deck.indexOf(id);
    if (idx !== -1) {
        deck.splice(idx, 1);
        battle.ready[userId] = false;
    }
    return battle;
}

function toggleReady(userId) {
    const battle = getBattleByUser(userId);
    if (!battle) return null;

    battle.ready[userId] = !battle.ready[userId];
    return battle;
}

function cancelBattleByUser(userId) {
    const battle = getBattleByUser(userId);
    if (!battle) return null;

    battles.delete(battle.id);
    return battle;
}

function deleteBattle(id) {
    battles.delete(id);
}

// Build fighters from decks (ID-based, from inventory)
function buildFighters(battle) {
    function buildSide(userId) {
        const inv = getUserInventory(userId) || [];

        return battle.decks[userId]
            .map(id => {
                const ball = inv.find(b => b.id === id);
                if (!ball) return null;

                const threat = ball.threat || "Wolf";
                const mult = THREAT_MULTIPLIERS[threat] || 1.0;

                return {
                    owner: userId,
                    id,
                    name: ball.display || ball.slug || id,
                    maxHp: ball.hp,
                    hp: ball.hp,
                    atk: ball.atk,
                    threat,
                    mult
                };
            })
            .filter(Boolean);
    }

    return {
        side1: buildSide(battle.user1),
        side2: buildSide(battle.user2)
    };
}

// Pick target: enemy with lowest HP
function pickTarget(enemies) {
    let target = null;
    for (const e of enemies) {
        if (e.hp <= 0) continue;
        if (!target || e.hp < target.hp) {
            target = e;
        }
    }
    return target;
}

// Run the full battle simulation
function runBattle(battle) {
    const { side1, side2 } = buildFighters(battle);

    const logLines = [];
    let turn = 1;
    const MAX_TURNS = 200;

    function alive(side) {
        return side.filter(c => c.hp > 0);
    }

    // Guard: if either side has no fighters, immediate draw
    if (!side1.length || !side2.length) {
        logLines.push("The battle ended in a draw.");
        return {
            winner: null,
            side1,
            side2,
            logLines
        };
    }

    while (alive(side1).length > 0 && alive(side2).length > 0 && turn <= MAX_TURNS) {
        const attackers = [
            ...alive(side1).map(c => ({ c, side: 1 })),
            ...alive(side2).map(c => ({ c, side: 2 }))
        ];

        // Each fighter attacks once per turn
        for (const { c, side } of attackers) {
            if (c.hp <= 0) continue;

            const enemies = side === 1 ? alive(side2) : alive(side1);
            if (enemies.length === 0) break;

            const target = pickTarget(enemies);
            if (!target) break;

            // 10% miss chance
            const miss = Math.random() < 0.1;
            if (miss) {
                logLines.push(`Turn ${turn}: ${c.name} missed ${target.name} 💨`);
                continue;
            }

            const rawDamage = c.atk * c.mult;
            const damage = Math.max(1, Math.round(rawDamage));
            target.hp = Math.max(0, target.hp - damage);

            logLines.push(`Turn ${turn}: ${c.name} dealt ${damage} damage to ${target.name} 💥`);

            if (target.hp <= 0) {
                logLines.push(`Turn ${turn}: ${c.name} defeated ${target.name} ☠️`);
            }
        }

        turn++;
    }

    const alive1 = alive(side1);
    const alive2 = alive(side2);

    let winner = null;
    if (alive1.length > 0 && alive2.length === 0) {
        winner = battle.user1;
        logLines.push(`Winner: <@${winner}> 🏆`);
    } else if (alive2.length > 0 && alive1.length === 0) {
        winner = battle.user2;
        logLines.push(`Winner: <@${winner}> 🏆`);
    } else {
        logLines.push("The battle ended in a draw.");
    }

    return {
        winner,
        side1,
        side2,
        logLines
    };
}

module.exports = {
    beginBattle,
    getBattleById,
    getBattleByUser,
    addToDeck,
    removeFromDeck,
    toggleReady,
    cancelBattleByUser,
    deleteBattle,
    runBattle
};
