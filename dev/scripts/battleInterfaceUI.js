// Goals:
// Currency 
// Troops (images)
// Current Wave
// Wave time 
// Pause (Logic done; just show button)
// Call squad UI (Shows Squad stats) 

/**
 * Utility bar across the bottom of the battle screen: currency, squad cards, wave time
 * with a pause button, and the current wave.
 */
class BattleInterfaceUI {
    /**
     * @param {{colors: number[]}} team team whose colors the squad cards are drawn in
     */
    constructor (team) {
        this.team = team;
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
     * Draw the pause button (the pause logic itself lives elsewhere)
     * @returns {boolean} true if the mouse is over the button
     */
    drawPauseButton() {
        const hovered = this.isOver(this.pauseX, this.pauseY, this.pauseWidth, this.pauseHeight);

        fill(hovered ? color(120, 170, 100) : color(80, 120, 70));
        stroke(255);
        strokeWeight(1);
        rect(this.pauseX, this.pauseY, this.pauseWidth, this.pauseHeight, 5);

        // Pause icon: two vertical bars
        noStroke();
        fill(255);
        rect(this.pauseX + 12, this.pauseY + 8, 5, 14);
        rect(this.pauseX + 23, this.pauseY + 8, 5, 14);

        return hovered;
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
        if (mouseY < this.barY) {
            return false;
        }

        if (this.isOver(this.pauseX, this.pauseY, this.pauseWidth, this.pauseHeight)) {
            // PAUSE LOGIC (teammate): call the pause function here
            return true;
        }

        const cards = this.getCards();
        for (let i = 0; i < cards.length; i++) {
            if (this.isOver(this.cardX(i), this.cardY, this.cardSize, this.cardSize)) {
                // Click the selected card again to deselect it
                this.selectedSquadBase = this.selectedSquadBase === cards[i] ? null : cards[i];

                // STATS DISPLAY (teammate): show the stats of this.selectedSquadBase here
                // (name, cost, pros, cons, startingTroops), and hide them when it is null
                return true;
            }
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
