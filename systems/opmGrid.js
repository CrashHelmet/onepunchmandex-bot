// systems/opmGrid.js

const { getEmojiForSlug } = require("./opmEmojis");
const { characters } = require("./characters");

// 10 per row (Dex standard)
const PER_ROW = 23;
const MAX_ROWS = 4; // ⭐ limit to 4 rows visible

/**
 * Build emoji grid lines (10 per row)
 */
function buildGridLines(slugs) {
    const lines = [];
    let current = [];

    for (const slug of slugs) {
        const emoji = getEmojiForSlug(slug);
        const token = emoji || `\`${slug}\``;

        current.push(token);

        if (current.length === PER_ROW) {
            lines.push(current.join(" "));
            current = [];
        }
    }

    if (current.length > 0) {
        lines.push(current.join(" "));
    }

    // ⭐ Limit to 4 rows max
    return lines.slice(0, MAX_ROWS);
}

/**
 * Build unified Dex-style pages:
 * - Page 1: Owned + Missing
 * - Page 2+: Missing only
 */
function buildCompletionPages(userOwnedSlugs) {
    const allSlugs = characters.map(c => c.name).sort();

    const ownedSet = new Set(userOwnedSlugs);

    const ownedSlugs = allSlugs.filter(s => ownedSet.has(s));
    const missingSlugs = allSlugs.filter(s => !ownedSet.has(s));

    const total = allSlugs.length || 1;
    const ownedCount = ownedSlugs.length;
    const progression = (ownedCount / total) * 100;

    // Build grid lines (limited to 4 rows)
    const ownedLines = buildGridLines(ownedSlugs);
    const missingLines = buildGridLines(missingSlugs);

    const pages = [];

    // PAGE 1 — Owned + Missing
    pages.push({
        ownedLines,
        missingLines,
        progression
    });

    // PAGE 2+ — Missing only (still limited to 4 rows)
    let remaining = missingSlugs.slice(PER_ROW * MAX_ROWS);

    while (remaining.length > 0) {
        pages.push({
            ownedLines: [],
            missingLines: buildGridLines(remaining),
            progression
        });

        remaining = remaining.slice(PER_ROW * MAX_ROWS);
    }

    return pages;
}

module.exports = {
    buildCompletionPages
};
