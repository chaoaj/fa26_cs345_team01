const TROOP_OBJECTS = {
    knight: { x: 0, y: 0, w: 32, h: 32 },
    sword:  { x: 32, y: 0, w: 16, h: 16 },
    bow:    { x: 48, y: 0, w: 16, h: 22 }
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
		damage: 4,
		attackSpeed: 0.75,
		range: 110,
		projectile: {
			kind: 'fireball',
			radius: 6,
			speed: 240
		},
		visual: new Visual(function (cols) {
			// TODO: draw wand sprite here later
		})
	},
}

// defintions for troop objects
const TROOP_DEFS = {
	basic: {
		name: 'Basic',
		health: 10,
		armor: 1,
		speed: 50,
		moveTo: null,
		size: 64,
		visual: new Visual(function (cols) {
			let cut = TROOP_OBJECTS['knight'];
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
				offset: new Position(13, -1),
				startingAngle: 0,
				turnRange: [-Math.PI, Math.PI]
			}
		]
	},

  // ELF TROOP (SPIRIT BOUND) -----------------
  elf: {
		name: 'Elf',
		health: 8,
		armor: 0,
		speed: 65,
		moveTo: null,
		size: 64,
		visual: new Visual(function (cols) {
			// TODO: draw elf sprite later
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
		visual: new Visual(function (cols) {
			// TODO: draw wizard sprite later
		}),
		weapons: [
			{
				weapon: 'wand',
				offset: new Position(12, 0),
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
		cost: 1000,
		pros: [],
		cons: [],
		startingTroops: [
			{ troop: "basic", count: 10 }
		],
		formation: [
			new Position(45, 0),
			new Position(45, 45),
			new Position(45, -45),
			new Position(0, -22.5),
			new Position(0, 22.5),
			new Position(0, 67.5),
			new Position(0, -67.5),
			new Position(-45, 0),
			new Position(-45, 45),
			new Position(-45, -45)
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

  // wizard squad 
	wizard_squad: {
		name: 'Wizard Squad',
		faction: 'spiritBound_faction',
		cost: 1400,
		pros: [],
		cons: [],
		startingTroops: [
			{ troop: 'wizard', count: 2 }
		],
		formation: [
			new Position(35, -22),
			new Position(35, 22)
		]
	}
};