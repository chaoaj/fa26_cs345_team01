const WEAPON_DEFS = {
    weapon_id: {
      name: 'Basic',
      damage: 1,
      attackSpeed: 1,
      // unfinished 
    }
}

const TROOP_DEFS = {
    basic: {
        name: 'Basic',
        health: 10,
        armor: 1,
        speed: 50,
        size: 10,
        visual: new Visual(function(cols) {
            strokeWeight(0);
            fill(...cols);
            ellipse(0, 0, 5, 10);
        }),
        weapons: [
            {
                weapon: 'weapon_id',
                offset: new Position(0, 0),
                startingAngle: 0,
                turnRange: [ -Math.PI, Math.PI ]
            }
        ]
    }
};