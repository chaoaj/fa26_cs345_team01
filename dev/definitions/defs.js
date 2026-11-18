const TROOP_OBJECTS = {
    knight: { x: 0, y: 0, w: 32, h: 32 },
    sword:  { x: 32, y: 0, w: 16, h: 16 },
    bow:    { x: 48, y: 0, w: 16, h: 22 }
};

const WEAPON_DEFS = {
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
	}
}

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
	keep: { // the base or "keep" to  defend
		name: 'Keep',
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
	basic_squad: {
		name: 'Squad Template',
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
	}
}
