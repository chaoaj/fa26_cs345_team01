const troopBases = {};

class TroopBase {
    constructor (id, data) {
        this.id = id;
        this.name = data.name;
        this.health = data.health ?? 10;
        this.armor = data.armor ?? 0;
        this.size = data.size ?? 10;
        this.speed = data.speed ?? 50;
        this.weapons = data.weapons ?? [];
        this.visual = data.visual ?? null;
        troopBases[id] = this;
    }
}

class Troop {
    constructor (position, team, base) {
        this.base = base;
        this.health = base.health;
        this.position = position;
        this.team = team;
        this.weapons = base.weapons.map(w => ({
            weapon: w,
            angle: w.startingAngle,
            reload: 0,
            target: null
        }));
        this.moveTo = null;
    }

    draw() {
        push();
        translate(this.position.x, this.position.y);
        rotate(this.position.angle);
        this.visual.draw(this.team.colors);
        pop();
    }

    /**
     * Do something
     * @param {number} dt change since last time function called
     */
    tick(dt) {
        // DO STUFF
    }
}

function defineItems() {
    for (const [id, data] of Object.entries(WEAPON_DEFS)) {
        // REGISTER WEAPONS
    }
    for (const [id, data] of Object.entries(TROOP_DEFS)) {
        const troop = new TroopBase(id, data);
        troop.weapons = troop.weapons.map(w => ({
            weapon: weaponBases[w.weapon],
            offset: w.offset,
            startingAngle: w.startingAngle,
            turnRange: w.turnRange
        }));
    }
}