const weaponBases = {};

class WeaponBase {
  
  /**
  * Shared defintions for a weapon type
  * @param {string} id keys from WEAPON_DEFS
  * @param {Object} Troop data stats for this weapon
  */
  constructor (id, data) {
      this.id = id;
      this.name = data.name;
      this.type = data.type ?? 'melee'; // 'melee' or 'projectile' default to 'melee' if no type given 
      this.damage = data.damage ?? 1;
      this.attackSpeed = data.attackSpeed ?? 1;
      // this.armorPiercing = data.armorPiercing ?? 0; // TODO: armor piercing stat
      this.range = data.range ?? 100;
      this.visual = data.visual ?? null;
      weaponBases[id] = this;
    }
  }
  
  class Weapon {
    /**
    * Constructor for a Weaon mounted on a troop
    * @param {WeaponBase} base weapon type
    * @param {number} mount troops entry for this weapon {offset, startingAngle, turnRange}
    */
    constructor (base, mount ) { 
      this.base = base;
      this.offset = mount.offset;
      this.angle = mount.startingAngle;
      this.turnRange = mount.turnRange;
      this.reload = 0;
      this.target = null;
    }

    /**
     * Do something
     * @param {number} dt change since last time function called
     */
    tick(dt) {
      // DO STUFF
    }

    /**
     * Draw the weapon
     * @param {number} dt change since last time function called
     */
    draw(cols) {
      // DO STUFF
    }
}