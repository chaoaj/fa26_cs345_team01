const troopBases = {};

class TroopBase {
    constructor (id, data) {
        this.id = id;
        this.name = data.name;
        this.health = data.health ?? 10;
        this.armor = data.armor ?? 0;
        this.size = data.size ?? 10;
        this.speed = data.speed ?? 50;
        this.moveTo = data.moveTo ?? null;
        this.weapons = data.weapons ?? [];
        this.visual = data.visual ?? null;
        this.timer = 0;
        troopBases[id] = this;
    }
}

class Troop {
    constructor (position, team, base) {
        this.base = base;
        this.health = base.health;
        this.position = position;
        this.team = team;
        this.visual = base.visual;
        this.weapons = base.weapons.map(w => ({
            weapon: w,
            angle: w.startingAngle,
            reload: 0,
            target: null
        }));
        this.moveTo = base.moveTo;
    }

    draw() {
        push();
        translate(this.position.x, this.position.y);
        rotate(this.position.angle);
        this.visual.draw([255, 0, 0]);
        // this.visual.draw(this.team.colors);
        for (const wep of this.weapons) {
            push()
            rotate(wep.angle);
            wep.weapon.visual.draw([255, 0, 0]);
            pop();
        }
        pop();
    }

    /**
     * DO STUFF
     * @param {number} dt change since last time function called
     * @param {Troop[]} troops troops to search for a target
     */
    tick(dt) {
        // Targeting
        let target = this.weapons[0]?.target;
        if (target == null) {
            target = this.getNearestEnemy(troops);
        }
        for (const weapon of this.weapons) {
            weapon.target = target;
        }

        // TODO Implement Movement 
        if (target != null) {
            if (this.weapons[0].range >= this.position.distanceTo(target.position)) {
                this.moveTo = null;
            } else {
                this.moveTo = target.position;
            }
        }

        // Attack
        this.timer += dt;
        if (this.timer >= 60 / this.weapons[0].attackSpeed) {
            this.timer -= 60 / this.weapons[0].attackSpeed;
            this.attack(target);
        }
    }

    getNearestEnemy(troops) {
        let nearestEnemy = null;
        let nearestDistance = Infinity;

        for (const troop of troops) {
            if (troop === this || troop.team === this.team || troop.health <= 0) {
                continue;
            }

            const distance = this.position.distanceTo(troop.position);
            if (distance < nearestDistance) {
                nearestEnemy = troop;
                nearestDistance = distance;
            }
        }
        return nearestEnemy;
    }

    damage(amount) {
        this.health -= (amount - this.armor);
    }

    attack(target) {
        if (target != null && this.weapons[0].range >= this.position.distanceTo(target.position)) {
            if (this.weapons[0].type === 'melee') {
                target.damage(this.weapons[0].damage);
            } else if (this.weapons[0].type === 'projectile') {
                // TODO Implement projectile attack logic
            }
            
        }
    }
}

function defineItems() {
    for (const [id, data] of Object.entries(WEAPON_DEFS)) {
        for (const [id, data] of Object.entries(WEAPON_DEFS)) {
          new Weapon(id, data);
        }
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