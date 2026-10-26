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