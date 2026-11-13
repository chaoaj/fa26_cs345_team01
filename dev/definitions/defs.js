const WEAPON_DEFS = {
	sword: {
		name: 'Sword',
		type: 'melee',
		damage: 3,
		attackSpeed: 1.5,
		range: 10,
		visual: new Visual(function (cols) {
			strokeWeight(0);
			fill(50);
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
		visual: new Visual(function (cols) {
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
		visual: new Visual(function (cols) {
			strokeWeight(0);
			fill(...cols);
			ellipse(0, 0, 15, 30);
		}),
		weapons: [
			{
				weapon: 'sword',
				offset: new Position(1, -12),
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
			new Position(15, 0),
			new Position(15, 15),
			new Position(15, -15),
			new Position(0, -7.5),
			new Position(0, 7.5),
			new Position(0, -22.5),
			new Position(-15, 0),
			new Position(-15, 15),
			new Position(-15, -15),
			new Position(-30, -7.5)
		]
	}
}