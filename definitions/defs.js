const WEAPON_DEFS = {
  sword : {
    name: 'Sword',
    type: 'melee',
    damage: 3,
    attackSpeed: 1.5,
    range: 10,
    visual: new Visual(function(cols) {
      strokeWeight(0);
      fill(...cols);
      rect(0, -0.5, 10, 1);
      // TODO: Draw basic sword blade
    })
  },

  bow: {
    name: 'Bow',
    type: 'projectile',
    damage: 2,
    attackSpeed: 0.5,
    range: 100,
    visual: new Visual(function(cols) {
      strokeWeight(0);
      fill(...cols);
      // TODO: Draw basic bow
    })
  }
}

const TROOP_DEFS = {
    basic: {
        name: 'Basic',
        health: 10,
        armor: 1,
        speed: 50,
        moveTo: null,
        size: 10,
        visual: new Visual(function(cols) {
            strokeWeight(0);
            fill(...cols);
            ellipse(0, 0, 15, 30);
        }),
        weapons: [
            {
                weapon: 'sword',
                offset: new Position(0, 0),
                startingAngle: 0,
                turnRange: [ -Math.PI, Math.PI ]
            }
        ]
    },
    keep: { // the base or "keep" to  defend
        name: 'Keep',
        health: 100,
        armor: 0,
        speed: 0,
        size: 100,
        visual: new Visual(function(cols) {
            strokeWeight(0);
            fill(...cols);
            rect(0, 0, 200, 200);
        }),
        weapons: []
    }
};