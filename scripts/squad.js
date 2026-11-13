const squadBases = {};

/**
 * Represents a Squad template
 */
class SquadBase {
	/**
	 * Constructor
	 * @param {string} id 													Id of squad. Lowercase, no spaces
	 * @param {string} name 												Name of squad
	 * @param {Object} [config={}] 											Extra info
	 */
	constructor(id, name, config = {}) {
		this.id = id;
		this.name = name;
		squads[id] = this;

		this.startingTroops = config.startingTroops ?? [];			// Should be array of Objects { troop: string (id), count: number }
		this.formation = config.formation ?? [new Position(0, 0)];	// Array of positions for formation

        // Description
		this.pros = config.pros ?? [];
		this.cons = config.cons ?? [];
        // Cost
		this.cost = config.cost ?? 1000;

        // Which one shows up as the icon
		if ('iconicTroop' in config)
			this.iconicTroop = config.iconicTroop;

        // Can/cannot be given move order
		this.static = config.static ?? false;
        squadBases[id] = this;
	}

	/**
	 * Draw the basic troop, for UI
	 * @param {number} x 		center x
	 * @param {number} y 		center y
	 * @param {number[]} cols 	team colors
	 */
	drawBase(x, y, cols) {
		this.iconicTroop.drawBase(x, y, cols);
	}

	/**
	 * Draws golden phantom squad for showing deployment
	 * @param {Position} pos	position to draw at 
	 */
	drawPhantom(pos) {
		push();
		strokeWeight(0);
		const cols = liveCols;
		fill(cols[0], cols[1], cols[2], 255);
		let ct = 0;
		for (let i = 0; i < this.startingTroops.length; i++) {
			const troop = this.startingTroops[i].troop;
			for (let j = 0; j < this.startingTroops[i].count; j++) {
				const formationPosition = this.formation[ct++];
				const position = pos.addOffset(
					formationPosition.x,
					formationPosition.y
				);
				push();
				translate(position.x, position.y);
				rotate(position.angle);
				ellipse(0, 0, troop.size * 2, troop.sizeY * 2);
				triangle(0, troop.sizeY, 0, -troop.sizeY, troop.size * 1.25, 0);
				pop();
			}
		}
		pop();
	}
}

/**
 * Instance of a squad
 */
class Squad {
	/**
	 * Constructor
	 * @param {number} x 			center x
	 * @param {number} y 			center y
	 * @param {number} angle 		initial angle
	 * @param {SquadBase} base 		base squad
	 * @param {boolean} playerOwned true if player owned, false if AI
	 * @param {Mode} mode			game mode spawning it
	 */
	constructor(x, y, angle, base, playerOwned, mode) {
		this.pos = new Position(x, y, angle);
		this.base = base;
		this.playerOwned = playerOwned;
		this.troops = [];
		const squadSet = playerOwned ? mode.playerSquads : mode.enemySquads;
		squadSet.add(this);
		let ct = 0;
		this.allTroops = {};
		this.attack = null;
		this.dead = false;
		for (let i = 0; i < base.startingTroops.length; i++) { // Spawn count of troops
			const troop = base.startingTroops[i].troop;
			for (let j = 0; j < base.startingTroops[i].count; j++) {
				const position = this.getFormationPosition(ct++);
				const newTroop = new Troop(troop, position.x, position.y, playerOwned, position.angle, mode);
				newTroop.squad = this;
				this.troops.push(newTroop);
			}
			this.allTroops[troop.id] = { // Used for squad stats
				base: troop,
				maxCount: base.startingTroops[i].count,
				count: base.startingTroops[i].count,
				kills: 0,
				i: i
			}
		}

		// Data to reform squad after every 20% losses
		this.lastChange = this.troops.length;
		this.changeAmt = this.troops.length / 5;
	}

	/**
	 * Average position of squad members for squad position
	 */
	get currentPos() {
		let avgX = 0;
		let avgY = 0;
		for (const troop of this.troops) {
			avgX += troop.pos.x;
			avgY += troop.pos.y;
		}
		return new Position(avgX / this.troops.length, avgY / this.troops.length);
	}

	/**
	 * Creates list for side ui
	 */
	get sortedTroops() {
		return Object.values(this.allTroops).sort((a, b) => {
			if (a.count === 0 && b.count !== 0) return 1;
			if (a.count !== 0 && b.count === 0) return -1;
			return a.i - b.i;
		});
	}

	/**
	 * Run own move/AI code. Uses dt to determine how much time has passed/how much it should move/etc
	 * @param {number} dt	delta time in seconds
	 */
	tick(dt) {
		this.avgPos = this.currentPos;
		this.disPos = 0;
		for (const troop of this.troops) {
			const dst = troop.pos.distanceTo(this.avgPos) + troop.getDirectionalRadius(this.avgPos);
			if (dst > this.disPos)
				this.disPos = dst;
		}
	}

    /**
     * Check if any member of this squad is within the circle queried
     * @param {Position} pos    center of circle
     * @param {number} radius   radius of circle
     * @returns {Troop[]}       all of own troops or none
     */
	queryPos(pos, radius) {
		if (this.avgPos.distanceTo(pos) < this.disPos + radius) {
			return this.troops;
		}
		return [];
	}

	/**
	 * Order squad to move to this position
	 * @param {number} x move to this x
	 * @param {number} y move to this y
	 */
	move(x, y) {
		if (this.base.static)
			return;
		const newPos = new Position(x, y);
		let curPos = this.currentPos
		if (newPos.distanceTo(curPos) >= 50) {
			newPos.angle = curPos.angleTo(newPos);
		} else {
			newPos.angle = this.pos.angle;
		}
		this.pos = newPos;
		// Order all troops to move to the correct move location
		for (let i = 0; i < this.troops.length; i++) {
			this.troops[i].orderMove(this.getFormationPosition(i));
			// this.troops[i].moveLoc = this.getFormationPosition(i);
		}
	}

	/**
	 * Order squad to attack another squad
	 * @param {Squad} squad squad to attack
	 */
	orderAttack(squad) {
		this.attack = squad;
		if (this.base.static)
			return;
		let maxRange = 0;
		for (const troopEntry of Object.values(this.allTroops)) {
			for (const mount of troopEntry.base.weapons) {
				if (mount.weapon.range[1] > maxRange)
					maxRange = mount.weapon.range[1];
			}
		}
		for (const troop of this.troops) {
			for (const wep of troop.weapons) {
				troop.getTarget(wep, wep.mount.weapon);
			}
		}

		const squadPos = squad.currentPos;
		const ownPos = this.currentPos;

		const diff = squadPos.subtract(ownPos);
		const distance = diff.distance;

		console.log(`${this.base.name} is attacking ${squad.base.name}`)
		if (distance <= maxRange)
			return;
		squadPos.angle = squadPos.angleTo(ownPos);
		// Point maxRange away from the enemy squad
		const attackPos = squadPos.addOffset(
			maxRange,
			0
		);

		this.move(attackPos.x, attackPos.y);
	}

	/**
	 * Get the position of the ith troop in the formation based on current position/angle
	 * @param {number} i 	index
	 * @returns {Position}	position in formation
	 */
	getFormationPosition(i) {
		const position = this.base.formation[
			Math.min(i, this.base.formation.length - 1)
		];

		return this.pos.addOffset(
			position.x,
			position.y
		);
	}
}