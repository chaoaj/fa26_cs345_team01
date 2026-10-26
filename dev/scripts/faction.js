// Stores initialized objects
const factions = {};

// Tooltip padding
const PADDING = 40;

/**
 * Represents a single faction
 */
class Faction {
    /**
     * New faction
     * @param {string} id                   faction id. Lowercase, no spaces
     * @param {string} name                 name of the faction
     * @param {string} desc                 description
     * @param {string} col                  hex code color of the faction
     * @param {string[]} [pros=[]]          list of faction pros
     * @param {string[]} [cons=[]]          list of faction cons
     * @param {string} [base="castle_base"] base squad ID
     * @param {string[]} [squads=[]]        all squad IDs the faction can recruit 
     * @param {boolean} [playable=true]     is playable
     */
    constructor(id, name, desc, col, pros = [], cons = [], base = "castle_base", squads = [], playable = true) {
        this.id = id;
        factions[id] = this;
        this.name = name;
        this.col = col;
        this.desc = desc;
        this.base = base;
        this.pros = pros;
        this.cons = cons;
        this.squads = squads;
        this.bgColor = [
            parseInt(this.col.substring(1, 3), 16),
            parseInt(this.col.substring(3, 5), 16),
            parseInt(this.col.substring(5, 7), 16)
        ];
        this.darkerColor = [
            this.bgColor[0] * 0.75,
            this.bgColor[1] * 0.75,
            this.bgColor[2] * 0.75
        ];
        this.btnColor = [
            this.bgColor[0] * 1.5 > 255 ? 255 : this.bgColor[0] * 1.5,
            this.bgColor[1] * 1.5 > 255 ? 255 : this.bgColor[1] * 1.5,
            this.bgColor[2] * 1.5 > 255 ? 255 : this.bgColor[2] * 1.5
        ];
        this.hvrColor = [
            this.bgColor[0] * 2 > 255 ? 255 : this.bgColor[0] * 2,
            this.bgColor[1] * 2 > 255 ? 255 : this.bgColor[1] * 2,
            this.bgColor[2] * 2 > 255 ? 255 : this.bgColor[2] * 2
        ];
        this.playable = playable;
    }

    /**
     * Draw button for MenuStages.SELECT
     * @param {number} x x position of left
     * @param {number} y y position of top
     * @param {number} w width
     * @param {number} h height
     */
    drawUI(x, y, w, h) {
        push();
        translate(x, y);
        strokeWeight(0);
        if (mouseY >= y && mouseY <= y + h && mouseX >= x + ((mouseY - y) / 2) && mouseX <= x + w - ((y + h - mouseY) / 2)) {
            fill(this.darkerColor[0], this.darkerColor[1], this.darkerColor[2]);
        }
        else {
            fill(this.col);
        }

        beginShape();
        vertex(0, 0);
        vertex(h / 2, h);
        vertex(w, h);
        vertex(w - h / 2, 0);
        endShape(CLOSE);
        textSize(h / 2);
        fill(255);
        text(this.name, w / 2, h / 2);

        pop();
    }

    /**
     * Full faction screen for MenuStages.FACTION
     * @param {*} menu 
     */
    drawScreen(menu) {
        textAlign(CENTER, CENTER);
        fill(255);
        strokeWeight(0);

        // We need to calculate the total height of the card so as to center it properly
        const titleH = 64;
        const titleGap = 20;

        const descSize = 24;
        const descW = 4 * RES_X / 5;
        const descLineH = descSize * 1.2;

        // Calculate wrapped description height
        textSize(descSize);
        const words = this.desc.split(/\s+/);
        let line = "";
        let descLines = 1;
        for (const word of words) {
            const testLine = line.length === 0 ? word : line + " " + word;

            if (textWidth(testLine) > descW) {
                descLines++;
                line = word;
            }
            else {
                line = testLine;
            }
        }
        const descH = descLines * descLineH;

        const sectionGap = 20;
        const headerH = 30;
        const itemH = 25;
        const listGap = 25;
        const buttonH = 50;
        const buttonGap = 25;

        const listH =
            headerH +
            Math.max(this.pros.length, this.cons.length) * itemH +
            listGap + 50 + headerH + sectionGap;

        const totalH =
            titleH +
            titleGap +
            descH +
            sectionGap +
            listH +
            buttonGap +
            buttonH;

        // Top is the start of the card, y is the offset we'll use/increment for each item to add over time
        const top = (RES_Y - totalH) / 2;
        let y = top; // Tracks where to place text
        fill(this.darkerColor[0], this.darkerColor[1], this.darkerColor[2]);
        rect(RES_X / 10 - PADDING, top - PADDING, 4 * RES_X / 5 + 2 * PADDING, totalH + 2 * PADDING);
        // Title
        fill(255);
        textSize(titleH);
        textAlign(CENTER, CENTER);
        text(this.name, RES_X / 2, y + titleH / 2);
        y += titleH + titleGap;
        // Description
        textSize(descSize);
        textWrap(WORD);
        text(
            this.desc,
            RES_X / 10,
            y,
            descW
        );
        y += descH + sectionGap;
        // Headers
        textSize(28);
        textAlign(CENTER, TOP);
        text("Pros", 1.75 * RES_X / 5, y);
        text("Cons", 3.25 * RES_X / 5, y);
        y += headerH;
        // Offsets for list
        let prosY = y;
        let unitsY = y;
        textSize(24);
        // Pros and Cons
        const maxPC = Math.max(this.pros.length, this.cons.length);
        for (let i = 0; i < maxPC; i++) {
            textAlign(LEFT, TOP);
            fill(...STOCK_COLORS.PROS);
            if (i < this.pros.length) {
                text(`+ ${this.pros[i]}`, RES_X / 5, prosY);
            }
            textAlign(RIGHT, TOP);
            fill(...STOCK_COLORS.CONS)
            if (i < this.cons.length) {
                text(`− ${this.cons[i]}`, 4 * RES_X / 5, prosY);
            }
            prosY += itemH;
        }
        y = prosY;
        // Faction Squads
        textAlign(CENTER, TOP);
        textSize(28);
        fill(255);
        text("Units", RES_X / 2, y);
        y += headerH;
        let startX = RES_X / 2 - (this.squads.length / 2 * 100);
        for (const squad of this.squads) {
            fill(149, 179, 120);
            stroke(...liveCols);
            strokeWeight(4);
            rect(startX + 20, y, 60, 60);
            squad.iconicTroop.drawBase(startX + 50, y + 30, liveCols);
            startX += 100;
        }
        startX = RES_X / 2 - (this.squads.length / 2 * 100);
        // Draw tooltip (if one) after drawing squads so they aren't overlapped by others
        for (const squad of this.squads) {
            if (mouseX >= startX + 18 && mouseX <= startX + 82 && mouseY >= y - 2 && mouseY <= y + 62) {
                const height = 60 + squad.pros.length * 20 + squad.cons.length * 20;
                textAlign(LEFT, TOP);
                textSize(20);
                let width = textWidth(squad.name);
                for (const pro of squad.pros) {
                    let w = textWidth(`+ ${pro}`)
                    if (w > width)
                        width = w;
                }
                for (const con of squad.cons) {
                    let w = textWidth(`− ${con}`)
                    if (w > width)
                        width = w;
                }
                fill("#242424");
                strokeWeight(0);
                rect(startX + 18, y - height - 2, width + 20, height);
                fill(255);
                let textY = y - height + 8;
                text(squad.name, startX + 28, textY);
                textY += 20;
                textSize(16);
                fill(...STOCK_COLORS.PROS);
                for (const pro of squad.pros) {
                    text(`+ ${pro}`, startX + 28, textY + 2);
                    textY += 20;
                }
                fill(...STOCK_COLORS.CONS)
                for (const con of squad.cons) {
                    text(`− ${con}`, startX + 28, textY + 2);
                    textY += 20;
                }
                fill(255);
                text(`Cost: ${squad.cost}`, startX + 28, textY + 2);
            }
            startX += 100;
        }
        y += 60 + listGap;
        strokeWeight(0);
        textAlign(CENTER, TOP);
        textSize(28);
        // Start Button
        menu.btnOffset = y;
        if (mouseX >= 11 * RES_X / 20 && mouseX <= 4 * RES_X / 5 && mouseY >= y && mouseY <= y + 50) {
            fill(...this.btnColor)
        } else {
            fill(this.col);
        }
        rect(11 * RES_X / 20, y, 5 * RES_X / 20, buttonH);
        // Go Back Button
        if (mouseX >= RES_X / 5 && mouseX <= 9 * RES_X / 20 && mouseY >= y && mouseY <= y + 50) {
            fill(...this.btnColor)
        } else {
            fill(this.col);
        }
        rect(RES_X / 5, y, 5 * RES_X / 20, buttonH);
        // Button Text
        fill(255);
        textAlign(CENTER, CENTER);
        text("Start Battle", 13.5 * RES_X / 20, y + buttonH / 2);
        text("Go Back", 6.5 * RES_X / 20, y + buttonH / 2);
    }
}

// Faction Declarations
// Generic medieval faction
new Faction(
    'empire',
    'The Empire',
    'A traditional medieval realm whose armies wield both steel and magic.',
    '#8033af',
    [
        "Cheap Units",
        "Versatile Army"
    ],
    [ "Lacking Elite Units" ],
    "castle_base",
    [
        "spear_regiment",
        "archer_regiment",
        "pike_regiment",
        "tercio_regiment",
        "sword_regiment",
        "catapult_squad",
        "knight_archer_squad",
        "knight_lancer_squad",
        "mage_cadre",
        "priestly_choir",
        "angel_squad"
    ]
);
// Monsters faction
new Faction(
    'monsters',
    'Monsters',
    'A vampire-led host of undead that overwhelms its enemies through dark magic and endless hordes.',
    '#242424',
    [
        "Excellent Elite Units",
        "Regeneration"
    ],
    [
        "Weak Low Tier Units",
        "Limited Ranged Options"
    ],
    "vampire_castle_base",
    [
        "spider_horde",
        "troll_tribe",
        "giant"
    ],
    false
);
// Undead vampire faction
new Faction(
    'undead',
    'The Midnight Aristocracy',
    'A vampire-led host of undead that overwhelms its enemies through dark magic and endless hordes.',
    '#9a1115',
    [
        "Excellent Elite Units",
        "Regeneration"
    ],
    [
        "Weak Low Tier Units",
        "Limited Ranged Options"
    ],
    "vampire_castle_base",
    [
        "zombie_horde",
        "skeleton_spear_regiment",
        "skeleton_archer_regiment",
        "spirit_host",
        "dullahan_squad",
        "reaper_squad",
        "vampire_squad",
        "vampiric_nobility"
    ]
);
// Felt like making a sci-fi faction
new Faction(
    'visitors',
    'The Visitors',
    'A technologically advanced civilization mysteriously cast into an unfamiliar world.',
    '#3462ad',
    [ "Advanced Technology" ],
    [
        "Small Unit Counts",
        "Limited Melee Options"
    ],
    "fortified_camp_base",
    [
        "rifle_squad",
        "assault_squad",
        "guard_squad",
        "artillery_squad",
        "tank_squad",
        "lancer_squad",
        "knight_squad",
        "crusader_squad",
        "citadel_squad"
    ]
);