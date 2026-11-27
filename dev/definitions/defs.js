const TROOP_OBJECTS = {
  // knight sprite & walking frames
  knight: { x: 0, y: 0, w: 32, h: 32 },
  knightWalk: [ 
    { x: 0,  y: 0, w: 32, h: 32 }, 
    { x: 32, y: 0, w: 32, h: 32 },
    { x: 64, y: 0, w: 32, h: 32 },
    { x: 96, y: 0, w: 32, h: 32 }
  ],

  // wizard sprite & walking frames
  wizard: { x: 0, y: 32, w: 32, h: 32 },
  wizardWalk: [ 
    { x: 0,  y: 32, w: 32, h: 32 },
    { x: 32, y: 32, w: 32, h: 32 },
    { x: 64, y: 32, w: 32, h: 32 },
    { x: 96, y: 32, w: 32, h: 32 }
  ],

  // elf sprite & walking frames
  elf: { x: 0, y: 64, w: 32, h: 32 },
  elfWalk: [ 
    { x: 0,  y: 64, w: 32, h: 32 },
    { x: 32, y: 64, w: 32, h: 32 },
    { x: 64, y: 64, w: 32, h: 32 },
    { x: 96, y: 64, w: 32, h: 32 }
  ],
  
  // troop weapons sprite
  sword: { x: 128, y: 0,  w: 32, h: 32 },
  bow:   { x: 160, y: 0,  w: 32, h: 16 },
  wand:  { x: 128, y: 32, w: 32, h: 32 },
  dagger: { x: 128, y: 64, w: 32, h: 32 }
};

// defintions for weapon objects
const WEAPON_DEFS = {
  // sword weapon
	sword: {
		name: 'Sword',
		type: 'melee',
		damage: 3,
		attackSpeed: 1.5,
		range: 10,
		visual: new Visual(function (cols) {
			let cut = TROOP_OBJECTS['sword'];
			let scaleFactor = 2;
			let destW = cut.w * scaleFactor;
			let destH = cut.h * scaleFactor;
			let drawX = 0;
			let drawY = -destH / 2;
			if (typeof troopSprites !== 'undefined' && troopSprites && troopSprites.width > 0) {
				image(troopSprites, drawX, drawY, destW, destH, cut.x, cut.y, cut.w, cut.h);
			}
		})
	},

  // bow weapon
	bow: {
		name: 'Bow',
		type: 'projectile',
		damage: 2,
		attackSpeed: 0.5,
		range: 100,
		visual: new Visual(function (cols) {
			let cut = TROOP_OBJECTS['bow'];
			let scaleFactor = 2;
			let destW = cut.w * scaleFactor;
			let destH = cut.h * scaleFactor;
			let drawX = 0;
			let drawY = -destH / 2;
			if (typeof troopSprites !== 'undefined' && troopSprites && troopSprites.width > 0) {
				image(troopSprites, drawX, drawY, destW, destH, cut.x, cut.y, cut.w, cut.h);
			}
		})
	},
  
  // wand weapon 
  wand: {
		name: 'Wand',
		type: 'projectile',
		damage: 5,
		attackSpeed: 0.75,
		range: 110,
		projectile: {
			kind: 'fireball',
			radius: 6,
			speed: 240
		},
    visual: new Visual(function (cols) {
			let cut = TROOP_OBJECTS['wand'];
			let scaleFactor = 2;
			let destW = cut.w * scaleFactor;
			let destH = cut.h * scaleFactor;
			let drawX = 0;
			let drawY = -destH / 2;
			if (typeof troopSprites !== 'undefined' && troopSprites && troopSprites.width > 0) {
				image(troopSprites, drawX, drawY, destW, destH, cut.x, cut.y, cut.w, cut.h);
			}
		})
	},

  // dagger weapon
  dagger: {
    name: 'Dagger',
    type: 'melee',
    damage: 2.5,
    attackSpeed: 1.2,
    range: 7,
      visual: new Visual(function (cols) {
        let cut = TROOP_OBJECTS['dagger'];
        let scaleFactor = 2;
        let destW = cut.w * scaleFactor;
        let destH = cut.h * scaleFactor;
        let drawX = 0;
        let drawY = -destH / 2;
        if (typeof troopSprites !== 'undefined' && troopSprites && troopSprites.width > 0) {
          image(troopSprites, drawX, drawY, destW, destH, cut.x, cut.y, cut.w, cut.h);
        }
      })
  }
}

// defintions for troop objects
const TROOP_DEFS = {
  // KNIGHT TROOP (IMPERIAL) -----------------------
	basic: {
		name: 'Knight',
		health: 10,
		armor: 1,
		speed: 50,
		moveTo: null,
		size: 64,
    visual: new Visual(function (cols, frame = 0) {
			let frames = TROOP_OBJECTS['knightWalk']; // use 'wizardWalk' for wizard
			let cut = frames[frame % frames.length];
			let scaleFactor = 2;
			let destW = cut.w * scaleFactor;
			let destH = cut.h * scaleFactor;
			let drawX = -destW / 2;
			let drawY = -destH / 2;
			if (typeof troopSprites !== 'undefined' && troopSprites && troopSprites.width > 0) {
				image(troopSprites, drawX, drawY, destW, destH, cut.x, cut.y, cut.w, cut.h);
			}
		}),
		weapons: [
			{
				weapon: 'sword',
				offset: new Position(0, 1),
				startingAngle: 0,
				turnRange: [-Math.PI, Math.PI]
			}
		]
	},

  // ROYAL ARCHER (IMPERIAL) -----------------
  royal_archer: {
		name: 'Archer',
		health: 8,
		armor: 0,
		speed: 60,
		moveTo: null,
		size: 64,
		visual: new Visual(function (cols) {
			// TODO: draw archer sprite later
		}),
		weapons: [
			{
				weapon: 'bow',
				offset: new Position(12, 0),
				startingAngle: 0,
				turnRange: [-Math.PI, Math.PI]
			}
		]
	},

  // WIZARD TROOP (SPIRIT BOUND) -----------------
  wizard: {
		name: 'Wizard',
		health: 7,
		armor: 0,
		speed: 45,
		moveTo: null,
		size: 64,
    visual: new Visual(function (cols, frame = 0) {
			let frames = TROOP_OBJECTS['wizardWalk'];
			let cut = frames[frame % frames.length];
			let scaleFactor = 2;
			let destW = cut.w * scaleFactor;
			let destH = cut.h * scaleFactor;
			let drawX = -destW / 2;
			let drawY = -destH / 2;
			if (typeof troopSprites !== 'undefined' && troopSprites && troopSprites.width > 0) {
				image(troopSprites, drawX, drawY, destW, destH, cut.x, cut.y, cut.w, cut.h);
			}
		}),
		weapons: [
			{
				weapon: 'wand',
				offset: new Position(-4, 6),
				startingAngle: 0,
				turnRange: [-Math.PI, Math.PI]
			}
		]
	},

  // ELF (SPIRIT BOUND) -----------------
  elf: {
		name: 'Elf',
		health: 6,
		armor: 0,
		speed: 60,
		moveTo: null,
		size: 64,
		visual: new Visual(function (cols, frame = 0) {
			let frames = TROOP_OBJECTS['elfWalk'];
			let cut = frames[frame % frames.length];
			let scaleFactor = 2;
			let destW = cut.w * scaleFactor;
			let destH = cut.h * scaleFactor;
			let drawX = -destW / 2;
			let drawY = -destH / 2;
			if (typeof troopSprites !== 'undefined' && troopSprites && troopSprites.width > 0) {
				image(troopSprites, drawX, drawY, destW, destH, cut.x, cut.y, cut.w, cut.h);
			}
		}),
		weapons: [
			{
				weapon: 'dagger',
				offset: new Position(-13, 10),
				startingAngle: 0,
				turnRange: [-Math.PI, Math.PI]
			}
		]
	},
  // centeral base 
	base: {
		name: 'Centeral Base',
		health: 100,
		armor: 0,
		speed: 0,
		size: 100,
		visual: new Visual(function (cols) {
			strokeWeight(0);
			fill(...cols);
			rect(0, 0, 200, 200);
		}),
		weapons: []
	}
};

const SQUAD_DEFS = {
  // knight squad 
	basic_squad: {
		name: 'Knight Squad',
    faction: 'imperial_faction',
		cost: 1000,
		pros: ['Cheap & dependable'],
		cons: ['too basic'],
		startingTroops: [
			{ troop: "basic", count: 6 }
		],
		formation: [
			new Position(45, 0),
			new Position(0, -22.5),
			new Position(0, 22.5),
			new Position(-45, 0),
			new Position(-45, 45),
			new Position(-45, -45)
		]
	},

  // archer squad
  archer_squad: {
    name: 'Royal Archer Squad',
    faction: 'imperial_faction',
    cost: 1000,
    pros: [],
    cons: [],
    startingTroops: [
      { troop: 'royal_archer', count: 3 }
    ],
    formation: [
      // decide formation
    ]
  },

  // wizard squad 
	wizard_squad: {
		name: 'Wizard Squad',
		faction: 'spiritBound_faction',
		cost: 1400,
		pros: ['Heavy hitting range'],
		cons: ['Slow (they are old)'],
		startingTroops: [
			{ troop: 'wizard', count: 2 }
		],
		formation: [
			new Position(35, -22),
			new Position(35, 22)
		]
	},

  // elf squad 
  elf_squad: {
		name: 'Elf Squad',
		faction: 'spiritBound_faction',
		cost: 1200,
		pros: [],
		cons: [],
		startingTroops: [
			{ troop: 'elf', count: 2 }
		],
		formation: [
			new Position(25, -20),
			new Position(25, 20)
		]
	},

  // steam punk squad 1 --- (UNFINISHED)
  steamPunk_melee: {
		name: 'Steampunk Melee',
		faction: 'steamPunk_faction',
		cost: 0,
		pros: [],
		cons: [],
		startingTroops: [
			{ troop: 'n/a', count: 0 }
		],
		formation: [
      // decide formation
		]
	},

    // steam punk squad 2 --- (UNFINISHED)
  steamPunk_ranged: {
		name: 'Steampunk Ranged',
		faction: 'steamPunk_faction',
		cost: 0,
		pros: [],
		cons: [],
		startingTroops: [
			{ troop: 'n/a', count: 0 }
		],
		formation: [
      // decide formation
		]
	},
};