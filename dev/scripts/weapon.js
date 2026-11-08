
const weaponBases = {};

class WeaponBase {
    constructor (id, data) {
        this.id = id;
        this.name = data.name;
        this.type = data.type ?? 'melee'; // defaults to melee if no type given 
        this.damage = data.damage ?? 1;
        this.attackSpeed = data.attackSpeed ?? 1
        this.range = data.range ?? 100;
        this.visual = data.visual ?? null;
        weaponBases[id] = this;
    }
  }
  

  class Weapon {
    constructor (base, mount ) {
      this.base = base;
      this.offset = mount.offset;
      this.angle = mount.startingAngle;
      this.turnRange = mount.turnRange;
      this.reload = 0;
      this.target = null;
    }
  }