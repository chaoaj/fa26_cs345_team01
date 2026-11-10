// Faction selection screen.
// To show it (e.g. after difficulty is confirmed):
//     mode = new FactionSelectScreen();
// On Confirm, the chosen Faction is in this.selected


/**
 * A playable faction
 * @param {string} id          lowercase, no spaces
 * @param {string} name        name shown on the card
 * @param {string} desc        brief description shown on the card
 * @param {number[]} primary   main color as [r, g, b]
 * @param {number[]} accent    secondary color as [r, g, b]
 * @param {string[]} squads    squad IDs (placeholders until squads exist)
 */
class Faction {
    constructor(id, name, desc, primary, accent, squads = []) {
        this.id = id;
        this.name = name;
        this.desc = desc;
        this.colors = { primary, accent };
        this.squads = squads;
    }
}


class FactionSelectScreen {
    constructor() {
        this.speed = 1;

        // The three playable factions and the themes that inspired them:
        //   Imperial    - a conquering war machine (Noxus in League of Legends, the Cabal in Destiny 2)
        //   Spiritbound - nature and spirit (Ionia in League of Legends, the Dryad in Terraria)
        //   Steampunk   - brass-and-steam inventors (Piltover in League of Legends)

        // In the squads, the archetypes I was aiming for 
        // Basic expendable troops
        // Juggernaut class
        // Tank class
        // Marksmen class
        // Speciality class
        // Assassin class
        // Something similar to this was what I was aiming for
        this.factions = [
            new Faction("imperial", "Imperial", "A ruthless war machine that wins through brute strength.",
                [178, 34, 34], [24, 24, 28], ["legionnaires", "shock_troops", "war_beasts"]),
            new Faction("spiritbound", "Spiritbound", "Swift warriors who fight in harmony with nature and spirit.",
                [94, 201, 140], [244, 143, 177], ["blade_dancers", "spirit_archers", "shrine_guardians"]),
            new Faction("steampunk", "Steampunk", "Inventors who outgun their enemies with brass and steam.",
                [46, 110, 184], [212, 175, 55], ["riflemen", "gear_walkers", "steam_cannons"])
        ];

        this.cardWidth = 700;
        this.cardHeight = 130;
        this.cardGap = 20;
        this.cardX = RES_X / 2 - this.cardWidth / 2;

        // Stack the cards vertically, one below the other
        let startY = 140;
        for (let i = 0; i < this.factions.length; i++) {
            this.factions[i].y = startY + i * (this.cardHeight + this.cardGap);
        }

        this.btnWidth = 200;
        this.btnHeight = 50;
        this.btnX = RES_X / 2 - this.btnWidth / 2;
        let lastCard = this.factions[this.factions.length - 1];
        this.btnY = lastCard.y + this.cardHeight + 30;

        this.selected = null;
    }

    tickBefore() {
        background(30, 30, 50);
    }

    tick(dt) {
        let anyHovered = false;

        textAlign(CENTER, CENTER);
        noStroke();
        fill(255);
        textSize(40);
        text("Select Your Faction", RES_X / 2, 70);

        // Faction cards
        for (let faction of this.factions) {
            let isHovered = this.isOver(this.cardX, faction.y, this.cardWidth, this.cardHeight);
            let isSelected = this.selected === faction;
            if (isHovered) {
                anyHovered = true;
            }

            if (isHovered) {
                fill(60, 60, 85);
            } else {
                fill(45, 45, 70);
            }
            stroke(isSelected ? 255 : 120);
            strokeWeight(isSelected ? 4 : 1);
            rect(this.cardX, faction.y, this.cardWidth, this.cardHeight, 10);
            strokeWeight(1);

            // Color swatch on the left: accent ring around the primary color
            let swatchY = faction.y + this.cardHeight / 2;
            noStroke();
            fill(faction.colors.accent);
            circle(this.cardX + 90, swatchY, 100);
            fill(faction.colors.primary);
            circle(this.cardX + 90, swatchY, 76);

            // Name and description to the right of the swatch
            fill(255);
            textAlign(LEFT, TOP);
            textSize(28);
            text(faction.name, this.cardX + 170, faction.y + 35);

            textSize(16);
            text(faction.desc, this.cardX + 170, faction.y + 80, this.cardWidth - 200);
            textAlign(CENTER, CENTER);
        }

        // Confirm button, disabled until a faction is selected
        let btnHovered = this.selected !== null &&
                         this.isOver(this.btnX, this.btnY, this.btnWidth, this.btnHeight);
        if (btnHovered) {
            anyHovered = true;
        }

        if (this.selected === null) {
            fill(90);           // Grey when disabled
        } else if (btnHovered) {
            fill(100, 160, 210);
        } else {
            fill(70, 130, 180);
        }

        stroke(255);
        rect(this.btnX, this.btnY, this.btnWidth, this.btnHeight, 10);

        noStroke();
        fill(255);
        textSize(20);
        text("Confirm", RES_X / 2, this.btnY + this.btnHeight / 2);

        // Set cursor once so multiple buttons don't override each other
        cursor(anyHovered ? HAND : ARROW);
    }

    drawAfter() {
        // Optional: Add any additional drawing after the main tick
    }

    mousePressed() {
        for (let faction of this.factions) {
            if (this.isOver(this.cardX, faction.y, this.cardWidth, this.cardHeight)) {
                this.selected = faction;
                return;
            }
        }

        if (this.selected !== null && this.isOver(this.btnX, this.btnY, this.btnWidth, this.btnHeight)) {
            // Transition to the game screen
            mode = new GameScreen();
            console.log("Faction selected: " + this.selected.name);
        }
    }

    isOver(x, y, w, h) {
        return mouseX >= x &&
               mouseX <= x + w &&
               mouseY >= y &&
               mouseY <= y + h;
    }
}
