const weaponBases = {};

class WeaponBase {
    constructor (id, data) {
        this.id = id;
        this.name = data.name;
        this.damage = data.health ?? 1;
        this.attackSpeed = data.attackSpeed ?? 1
        this.visual = data.visual ?? null;
        weaponBases[id] = this;
    }
  }
  
class weapon {
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
  }