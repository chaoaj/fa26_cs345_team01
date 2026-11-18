// Goals:
// Currency 
// Troops (images)
// Current Wave
// Wave time 
// Pause / speed (done)
// Call squad UI (Shows Squad stats) (done)

/**
 * Utility bar across the bottom of the battle screen: currency, squad cards, wave time
 * with a pause button, and the current wave.
 */
class BattleInterfaceUI {
    /**
     * @param {{colors: number[]}} team team whose colors the squad cards are drawn in
     * @param {GameScreen} game          game whose pause/speed state the buttons control
     */
    constructor (team, game) {
        this.team = team;
        this.game = game;
        this.barHeight = 60;
        this.barY = RES_Y - this.barHeight; // top edge of the bar

        // Placeholders until the game has real state for these
        this.currency = 0;
        this.wave = 1;
        this.waveTime = 0; // seconds left in the wave

        // Squad cards
        this.cardSize = 44;
        this.cardGap = 8;
        this.cardsX = 150;
        this.cardY = this.barY + (this.barHeight - this.cardSize) / 2;
        this.selectedSquadBase = null; // SquadBase of the clicked card
        this.iconScale = 0.6;          // troop visuals are about 64px, the card is 44px

        // Pause button, to the right of the time
        this.pauseWidth = 40;
        this.pauseHeight = 30;
        this.pauseX = RES_X / 2 + 50;
        this.pauseY = this.barY + (this.barHeight - this.pauseHeight) / 2;

        // Speed button, to the right of the pause button. Cycles through speeds
        this.speeds = [1, 2, 3];
        this.speedWidth = 40;
        this.speedHeight = this.pauseHeight;
        this.speedX = this.pauseX + this.pauseWidth + 8;
        this.speedY = this.pauseY;

        // Squad stats panel, top right below the taskbar. Shows game.selectedSquad (clicked on
        // the map) if set, otherwise this.selectedSquadBase (clicked card)
        this.statsWidth = 270;
        this.statsX = RES_X - this.statsWidth - 10;
        this.statsY = 70;
        this.statsPadding = 12;
        // worked out each frame from the content
        this.statsHeight = 0;
        this.statsTitleHeight = 26;
        this.statsLineHeight = 18;
        // one unit type: icon, name/count, stats line, weapon line
        this.statsRowHeight = 58;
        this.statsIconBox = 36;
        this.statsIconScale = 0.45;
        this.statsCloseSize = 20;
    }

    /**
     * Squad types to show a card for
     * @returns {SquadBase[]}
     */
    getCards() {
        return typeof squadBases !== 'undefined' ? Object.values(squadBases) : [];
    }

    /**
     * Draw the bar
     */
    draw() {
        let anyHovered = false;
        const midY = this.barY + this.barHeight / 2;

        noStroke();
        fill(50, 70, 50);
        rect(0, this.barY, RES_X, this.barHeight);

        fill(255);
        textSize(18);

        // Currency, left
        textAlign(LEFT, CENTER);
        text("Gold: " + this.currency, 15, midY);

        // Wave time, middle
        textAlign(CENTER, CENTER);
        text(this.formatTime(this.waveTime), RES_X / 2, midY);

        // Current wave, right
        textAlign(RIGHT, CENTER);
        text("Wave " + this.wave, RES_X - 15, midY);

        // Squad cards
        const cards = this.getCards();
        for (let i = 0; i < cards.length; i++) {
            if (this.drawCard(cards[i], this.cardX(i))) {
                anyHovered = true;
            }
        }

        // Pause button
        if (this.drawPauseButton()) {
            anyHovered = true;
        }

        // Speed button
        if (this.drawSpeedButton()) {
            anyHovered = true;
        }

        // Squad stats panel
        this.drawSquadStats();

        // Only set the hand here, so the rest of the screen keeps its own cursor
        if (anyHovered) {
            cursor(HAND);
        }
    }

    /**
     * Draw one squad card
     * @param {SquadBase} squadBase squad type this card is for
     * @param {number} x            left edge of the card
     * @returns {boolean}           true if the mouse is over the card
     */
    drawCard(squadBase, x) {
        const hovered = this.isOver(x, this.cardY, this.cardSize, this.cardSize);
        const selected = this.selectedSquadBase === squadBase;

        fill(hovered ? color(120, 170, 100) : color(80, 120, 70));
        stroke(selected ? 255 : 150);
        strokeWeight(selected ? 3 : 1);
        rect(x, this.cardY, this.cardSize, this.cardSize, 5);

        this.drawIcon(squadBase, x + this.cardSize / 2, this.cardY + this.cardSize / 2 - 4);

        // Cost along the bottom of the card
        noStroke();
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(10);
        text(squadBase.cost, x + this.cardSize / 2, this.cardY + this.cardSize - 8);

        strokeWeight(1);
        return hovered;
    }

    /**
     * Draw a squad's icon from its iconic troop, or else the first troop it starts with.
     * Falls back to a letter placeholder if there is no troop to draw.
     * @param {SquadBase} squadBase squad type
     * @param {number} cx           center x
     * @param {number} cy           center y
     */
    drawIcon(squadBase, cx, cy) {
        let troop = squadBase.iconicTroop ?? squadBase.startingTroops?.[0]?.troop;
        if (typeof troop === 'string') {
            troop = troopBases[troop];
        }

        if (troop && typeof troop.drawBase === 'function') {
            troop.drawBase(cx, cy, this.team.colors);
        } else if (troop && troop.visual) {
            push();
            translate(cx, cy);
            scale(this.iconScale);
            troop.visual.draw(this.team.colors);
            pop();
        } else {
            noStroke();
            fill(255);
            textAlign(CENTER, CENTER);
            textSize(18);
            text((squadBase.name ?? "?")[0], cx, cy);
        }
    }

    /**
     * Draw the pause button. Shows a pause icon while running and a play icon while paused
     * @returns {boolean} true if the mouse is over the button
     */
    drawPauseButton() {
        const hovered = this.isOver(this.pauseX, this.pauseY, this.pauseWidth, this.pauseHeight);
        const paused = this.game.paused;

        fill(hovered ? color(120, 170, 100) : color(80, 120, 70));
        stroke(255);
        strokeWeight(1);
        rect(this.pauseX, this.pauseY, this.pauseWidth, this.pauseHeight, 5);

        noStroke();
        fill(255);
        if (paused) {
            // Play icon: triangle pointing right
            triangle(this.pauseX + 14, this.pauseY + 7,
                     this.pauseX + 14, this.pauseY + 23,
                     this.pauseX + 28, this.pauseY + 15);
        } else {
            // Pause icon: two vertical bars
            rect(this.pauseX + 12, this.pauseY + 8, 5, 14);
            rect(this.pauseX + 23, this.pauseY + 8, 5, 14);
        }

        return hovered;
    }

    /**
     * Draw the speed button, labeled with the current speed (1x, 2x, ...)
     * @returns {boolean} true if the mouse is over the button
     */
    drawSpeedButton() {
        const hovered = this.isOver(this.speedX, this.speedY, this.speedWidth, this.speedHeight);

        fill(hovered ? color(120, 170, 100) : color(80, 120, 70));
        stroke(255);
        strokeWeight(1);
        rect(this.speedX, this.speedY, this.speedWidth, this.speedHeight, 5);

        noStroke();
        // Grey the label out while paused, since the speed isn't being applied
        fill(this.game.paused ? 170 : 255);
        textAlign(CENTER, CENTER);
        textSize(14);
        text(this.game.speed + "x", this.speedX + this.speedWidth / 2, this.speedY + this.speedHeight / 2);

        return hovered;
    }

    /**
     * Move to the next speed in the list, wrapping back to the first
     */
    cycleSpeed() {
        const i = this.speeds.indexOf(this.game.speed);
        this.game.speed = this.speeds[(i + 1) % this.speeds.length];
    }

    /**
     * Left edge of the squad card at the given index
     * @param {number} index position in the row of cards
     * @returns {number}     x position
     */
    cardX(index) {
        return this.cardsX + index * (this.cardSize + this.cardGap);
    }

    /**
     * Turn seconds into m:ss
     * @param {number} seconds time in seconds
     * @returns {string}       formatted time
     */
    formatTime(seconds) {
        const total = Math.max(0, Math.floor(seconds));
        const mins = Math.floor(total / 60);
        const secs = total % 60;
        return mins + ":" + String(secs).padStart(2, "0");
    }

    /**
     * Handle a click
     * @returns {boolean} true if the click was on the bar, so the game shouldn't use it
     */
    mousePressed() {
        if (this.statsMousePressed()) {
            return true;
        }

        if (mouseY < this.barY) {
            return false;
        }

        if (this.isOver(this.pauseX, this.pauseY, this.pauseWidth, this.pauseHeight)) {
            this.game.togglePause();
            return true;
        }

        if (this.isOver(this.speedX, this.speedY, this.speedWidth, this.speedHeight)) {
            this.cycleSpeed();
            return true;
        }

        const cards = this.getCards();
        for (let i = 0; i < cards.length; i++) {
            if (this.isOver(this.cardX(i), this.cardY, this.cardSize, this.cardSize)) {
                // Click the selected card again to deselect it
                this.selectedSquadBase = this.selectedSquadBase === cards[i] ? null : cards[i];

                // The squad stats panel shows this.selectedSquadBase. Clear the map
                // selection so the card's stats are shown instead of a live squad's
                this.game.selectedSquad = null;
                return true;
            }
        }
        return true;
    }

    // ---------------- Squad stats panel ----------------
    // Shows a squad type (clicked card) or a live squad (clicked on the map).

    /**
     * What to show: a live squad takes priority over a squad type
     * @returns {{squad: Squad|null, base: SquadBase|null}|null} null if nothing is selected
     */
    getStatsSelection() {
        const squad = this.game.selectedSquad ?? null;
        if (squad) {
            return { squad, base: squad.base };
        }
        const base = this.selectedSquadBase ?? null;
        if (base) {
            return { squad: null, base };
        }
        return null;
    }

    /**
     * One entry per unit type in the squad
     * @param {Squad|null} squad   live squad, or null for a squad type
     * @param {SquadBase} base     squad type
     * @returns {{troop: TroopBase, count: number, maxCount: number, kills: number|null}[]}
     */
    getStatsUnitRows(squad, base) {
        if (squad) {
            return squad.sortedTroops.map(entry => ({
                troop: entry.base,
                count: entry.count,
                maxCount: entry.maxCount,
                kills: entry.kills
            }));
        }
        return base.startingTroops.map(entry => ({
            troop: entry.troop,
            count: entry.count,
            maxCount: entry.count,
            kills: null
        }));
    }

    /**
     * Total and max health of a live squad's troops
     * @param {Squad} squad live squad
     * @returns {{current: number, max: number}}
     */
    getSquadHealth(squad) {
        let current = 0;
        let max = 0;
        for (const troop of squad.troops) {
            current += Math.max(0, troop.health);
            max += troop.base.health;
        }
        return { current, max };
    }

    /**
     * What the live squad is doing right now
     * @param {Squad} squad live squad
     * @returns {string}
     */
    getSquadStatus(squad) {
        if (squad.attack) {
            return "Attacking " + squad.attack.base.name;
        }
        if (squad.troops.some(t => t.moveTo)) {
            return "Moving";
        }
        return "Idle";
    }

    /**
     * Draw the squad stats panel, if a squad card or a squad on the map is selected
     */
    drawSquadStats() {
        const selection = this.getStatsSelection();
        if (!selection) {
            this.statsHeight = 0;
            return;
        }
        const { squad, base } = selection;
        const rows = this.getStatsUnitRows(squad, base);
        const left = this.statsX + this.statsPadding;
        const right = this.statsX + this.statsWidth - this.statsPadding;

        // Summary lines under the title
        const totalUnits = rows.reduce((sum, r) => sum + r.count, 0);
        const maxUnits = rows.reduce((sum, r) => sum + r.maxCount, 0);
        const summary = [];
        if (squad) {
            summary.push(squad.playerOwned ? "Your squad" : "Enemy squad");
            summary.push("Units: " + totalUnits + " / " + maxUnits);
            summary.push("Status: " + this.getSquadStatus(squad));
        } else {
            summary.push("Cost: " + base.cost);
            summary.push("Units: " + totalUnits);
            if (base.static) {
                summary.push("Static (can't be moved)");
            }
        }
        const health = squad ? this.getSquadHealth(squad) : null;

        // Work out the height first so the background fits the content
        let h = this.statsPadding + this.statsTitleHeight + summary.length * this.statsLineHeight;
        if (health) {
            // health bar
            h += this.statsLineHeight + 4;
        }
        // divider + "Units" heading
        h += 10 + this.statsLineHeight;
        h += rows.length * this.statsRowHeight;
        if (!squad) {
            h += this.statsListHeight(base.pros) + this.statsListHeight(base.cons);
        }
        h += this.statsPadding;
        this.statsHeight = h;

        // Background
        push();
        stroke(255);
        strokeWeight(1);
        fill(40, 60, 40, 235);
        rect(this.statsX, this.statsY, this.statsWidth, this.statsHeight, 6);

        this.drawStatsCloseButton();

        // Title
        let y = this.statsY + this.statsPadding;
        noStroke();
        fill(255);
        textAlign(LEFT, TOP);
        textSize(18);
        textStyle(BOLD);
        text(base.name ?? "Squad", left, y, right - left - this.statsCloseSize - 4);
        textStyle(NORMAL);
        y += this.statsTitleHeight;

        // Summary
        textSize(14);
        fill(220);
        for (const line of summary) {
            text(line, left, y);
            y += this.statsLineHeight;
        }

        if (health) {
            this.drawHealthBar(left, y + 2, right - left, 12, health.current, health.max);
            y += this.statsLineHeight + 4;
        }

        // Divider
        y += 4;
        stroke(150);
        line(left, y, right, y);
        noStroke();
        y += 6;

        fill(255);
        textSize(14);
        textStyle(BOLD);
        text("Units", left, y);
        textStyle(NORMAL);
        y += this.statsLineHeight;

        for (const row of rows) {
            this.drawUnitRow(row, left, y, right);
            y += this.statsRowHeight;
        }

        if (!squad) {
            y = this.drawStatsList("Pros", base.pros, left, y, color(150, 230, 150));
            y = this.drawStatsList("Cons", base.cons, left, y, color(240, 150, 150));
        }
        pop();
    }

    /**
     * One unit type: icon, "Name x count", stats line and weapons line
     */
    drawUnitRow(row, left, y, right) {
        const troop = row.troop;

        // Icon box
        stroke(150);
        fill(80, 120, 70);
        rect(left, y, this.statsIconBox, this.statsIconBox, 4);
        if (troop?.visual) {
            push();
            translate(left + this.statsIconBox / 2, y + this.statsIconBox / 2);
            scale(this.statsIconScale);
            troop.visual.draw(this.team.colors);
            pop();
        }

        const textX = left + this.statsIconBox + 8;
        noStroke();
        textAlign(LEFT, TOP);

        // Name and count
        fill(255);
        textSize(14);
        const countText = row.count === row.maxCount
            ? "x" + row.count
            : row.count + " / " + row.maxCount;
        text((troop?.name ?? "Unknown") + "  " + countText, textX, y);

        // Stats
        fill(200);
        textSize(12);
        if (troop) {
            let stats = "HP " + troop.health + "   Armor " + troop.armor + "   Speed " + troop.speed;
            if (row.kills !== null) {
                stats += "   Kills " + row.kills;
            }
            text(stats, textX, y + 18);

            // Weapons: name, damage and range
            const weapons = (troop.weapons ?? [])
                .map(mount => mount.weapon)
                .filter(w => w)
                .map(w => w.name + " (" + w.damage + " dmg, " + w.range + " rng)");
            text(weapons.length ? weapons.join(", ") : "No weapons", textX, y + 34, right - textX);
        }
    }

    /**
     * Health bar, green to red as it empties
     */
    drawHealthBar(x, y, w, h, current, max) {
        const pct = max > 0 ? constrain(current / max, 0, 1) : 0;
        noStroke();
        fill(30);
        rect(x, y, w, h, 3);
        fill(lerpColor(color(220, 60, 60), color(90, 200, 90), pct));
        rect(x, y, w * pct, h, 3);

        fill(255);
        textAlign(CENTER, CENTER);
        textSize(10);
        text(Math.ceil(current) + " / " + max, x + w / 2, y + h / 2);
        textAlign(LEFT, TOP);
    }

    /**
     * Height a pros/cons list takes (nothing if the list is empty)
     * @param {string[]} items
     */
    statsListHeight(items) {
        return items && items.length ? 6 + this.statsLineHeight * (items.length + 1) : 0;
    }

    /**
     * Draw a pros/cons list with a heading
     * @returns {number} y after the list
     */
    drawStatsList(heading, items, left, y, col) {
        if (!items || !items.length) {
            return y;
        }
        y += 6;
        fill(col);
        textSize(14);
        textStyle(BOLD);
        text(heading, left, y);
        textStyle(NORMAL);
        y += this.statsLineHeight;
        textSize(12);
        fill(220);
        for (const item of items) {
            text("• " + item, left + 4, y);
            y += this.statsLineHeight;
        }
        return y;
    }

    statsCloseX() {
        return this.statsX + this.statsWidth - this.statsCloseSize - 6;
    }

    statsCloseY() {
        return this.statsY + 6;
    }

    drawStatsCloseButton() {
        const hovered = this.isOver(this.statsCloseX(), this.statsCloseY(), this.statsCloseSize, this.statsCloseSize);
        stroke(255);
        fill(hovered ? color(160, 70, 70) : color(80, 120, 70));
        rect(this.statsCloseX(), this.statsCloseY(), this.statsCloseSize, this.statsCloseSize, 4);

        // X icon
        const pad = 6;
        strokeWeight(2);
        line(this.statsCloseX() + pad, this.statsCloseY() + pad,
             this.statsCloseX() + this.statsCloseSize - pad, this.statsCloseY() + this.statsCloseSize - pad);
        line(this.statsCloseX() + this.statsCloseSize - pad, this.statsCloseY() + pad,
             this.statsCloseX() + pad, this.statsCloseY() + this.statsCloseSize - pad);
        strokeWeight(1);

        if (hovered) {
            cursor(HAND);
        }
    }

    /**
     * Clear both kinds of selection
     */
    closeSquadStats() {
        this.game.selectedSquad = null;
        this.selectedSquadBase = null;
    }

    /**
     * Handle a click on the squad stats panel
     * @returns {boolean} true if the click was on the panel, so the game shouldn't use it
     */
    statsMousePressed() {
        if (this.statsHeight === 0 || !this.isOver(this.statsX, this.statsY, this.statsWidth, this.statsHeight)) {
            return false;
        }
        if (this.isOver(this.statsCloseX(), this.statsCloseY(), this.statsCloseSize, this.statsCloseSize)) {
            this.closeSquadStats();
        }
        return true;
    }

    isOver(x, y, w, h) {
        return mouseX >= x &&
               mouseX <= x + w &&
               mouseY >= y &&
               mouseY <= y + h;
    }
}
