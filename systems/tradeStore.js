// systems/tradeStore.js

const trades = new Map();

// How long a trade session stays alive (ms)
const TRADE_TIMEOUT = 15 * 60 * 1000; // 15 minutes

function _isExpired(trade) {
    return Date.now() - trade.updatedAt > TRADE_TIMEOUT;
}

function _cleanupIfExpired(trade) {
    if (!trade) return null;
    if (_isExpired(trade)) {
        trades.delete(trade.id);
        return null;
    }
    return trade;
}

function getTradeById(id) {
    const t = trades.get(id);
    return _cleanupIfExpired(t);
}

function getTradeByUser(userId) {
    for (const t of trades.values()) {
        if (t.user1 === userId || t.user2 === userId) {
            return _cleanupIfExpired(t);
        }
    }
    return null;
}

// messageId = original trade message to update
function beginTrade(user1, user2, messageId) {
    const id = `${user1}:${user2}:${Date.now()}`;
    const trade = {
        id,
        user1,
        user2,
        messageId,
        offers: {
            [user1]: [],   // now stores IDs, not slugs
            [user2]: []
        },
        locked: {
            [user1]: false,
            [user2]: false
        },
        confirmed: {
            [user1]: false,
            [user2]: false
        },
        createdAt: Date.now(),
        updatedAt: Date.now()
    };
    trades.set(id, trade);
    return trade;
}

// Add an ID to the user's offer
function addToTrade(userId, id) {
    const t = getTradeByUser(userId);
    if (!t) return null;

    const arr = t.offers[userId];

    // Prevent duplicates
    if (!arr.includes(id)) {
        arr.push(id);
    }

    // Reset locks + confirmations
    t.locked[t.user1] = false;
    t.locked[t.user2] = false;
    t.confirmed[t.user1] = false;
    t.confirmed[t.user2] = false;
    t.updatedAt = Date.now();

    return t;
}

// Remove an ID from the user's offer
function removeFromTrade(userId, id) {
    const t = getTradeByUser(userId);
    if (!t) return null;

    const arr = t.offers[userId];
    const idx = arr.indexOf(id);
    if (idx !== -1) {
        arr.splice(idx, 1);
    }

    // Reset locks + confirmations
    t.locked[t.user1] = false;
    t.locked[t.user2] = false;
    t.confirmed[t.user1] = false;
    t.confirmed[t.user2] = false;
    t.updatedAt = Date.now();

    return t;
}

function setLock(userId, locked) {
    const t = getTradeByUser(userId);
    if (!t) return null;

    t.locked[userId] = locked;

    // Reset confirmations
    t.confirmed[t.user1] = false;
    t.confirmed[t.user2] = false;
    t.updatedAt = Date.now();

    return t;
}

function confirmTrade(userId) {
    const t = getTradeByUser(userId);
    if (!t) return null;

    // Both must be locked first
    if (!t.locked[t.user1] || !t.locked[t.user2]) {
        return { trade: t, ready: false };
    }

    t.confirmed[userId] = true;
    t.updatedAt = Date.now();

    const bothConfirmed = t.confirmed[t.user1] && t.confirmed[t.user2];
    return { trade: t, ready: bothConfirmed };
}

function cancelTradeByUser(userId) {
    const t = getTradeByUser(userId);
    if (!t) return false;
    trades.delete(t.id);
    return true;
}

function cancelTradeById(id) {
    return trades.delete(id);
}

function getOffersForUser(userId) {
    const t = getTradeByUser(userId);
    if (!t) return [];
    return t.offers[userId] || [];
}

module.exports = {
    TRADE_TIMEOUT,
    beginTrade,
    getTradeByUser,
    getTradeById,
    addToTrade,
    removeFromTrade,
    setLock,
    confirmTrade,
    cancelTradeByUser,
    cancelTradeById,
    getOffersForUser
};
