// Global Variables
const MAX_SPREAD = Math.PI / 32;
const clickRange = 25; // Distance from a unit that will still be registered as clicking on them
const liveCols = [255, 215, 0];
const deadCols = [208, 208, 208];
const projCols = [255, 255, 0];
// Used for ids/names of duplicates
let pi = 0;
let ei = 0;

// Dictionaries to keep track of objects
const weapons = {};
const projectiles = {};
const troops = {};
const squads = {};

// ENUMS
const ProjectileType = Object.freeze({
	BULLET: 1,	// Simple projectile, ends on hitting enemy
	MISSILE: 2,	// Homing projectile
	AREA: 3,	// Does area attack upon hitting enemy
	PIERCE: 4	// Projectile continues through multiple enemies
});

// Type of area attack
const AreaType = Object.freeze({
	CIRCLE: 1,	// Hits everything in circle centered on point
	CONE: 2,	// Hits everything in cone from point
	LINE: 3		// Hits everything in straight line
});

const WeaponType = Object.freeze({
	NONE: 0,		// Shouldn't ever be used
	MELEE: 1,		// Melee attack
	PROJECTILE: 2,	// Shoots projectile
	LASER: 3,		// Instant damage to enemy
	AREA: 4			// Area attack
});

const MeleeType = Object.freeze({
	SWING: 1,	// Targets single enemy
	THRUST: 2	// Area attack in cone
});

const StatusType = Object.freeze({
	POISON: 1,	// Targets single enemy
	BLEED: 2,
	SLOW: 3,	// Area attack in cone
	SLEEP: 4,
	CHARMED: 5,
	STRENGTHEN: 6,
	TOUGHEN: 7,
	WEAKEN: 8
});

const StatusEffects = Object.freeze({
	1: Object.freeze({
		name: "Poison",
		negative: true,
		maxStack: 8,		// Max of 5 stacks
		time: 5,			// Lasts 5 seconds
		dmg: 1			// 0.5 damage per second
	}),
	2: Object.freeze({
		name: "Bleed",
		negative: true,
		maxStack: 5,
		time: 3,
		dmg: 2				// 1 damage per second
	}),
	3: Object.freeze({
		name: "Slow",
		negative: true,
		maxStack: 1,
		time: 5,
		speed: -0.5			// Slows down 50%
	}),
	4: Object.freeze({
		name: "Sleep",
		negative: true,
		maxStack: 1,
		time: 4,
		speed: -1,
		attacks: false		// Does nothing but used in tooltip
	}),
	5: Object.freeze({
		name: "Charmed",
		negative: true,
		maxStack: 1,
		time: 3,
		attackAllies: true	// Does nothing but used in tooltip
	}),
	6: Object.freeze({
		name: "Strengthened",
		negative: false,
		maxStack: 5,
		time: 5,
		dmg: 0.2 			// Deals 20% more damage
	}),
	7: Object.freeze({
		name: "Toughened",
		negative: false,
		maxStack: 5,
		time: 5,
		armor: 1			// +1 armor
	}),
	8: Object.freeze({
		name: "Weakened",
		negative: true,
		maxStack: 4,
		time: 5,
		dmg: -0.2			// Deals 20% less damage
	})
});

/**
 * Status effect affecting a troop
 * @typedef {Object} StatusEffect
 * @property {number} type			type of effect, from StatusType
 * @property {number} time			time left in effect
 * @property {number} stacks		number of stacks
 * @property {Troop}  inflictor		enemy who inflicted it
 */

// CLASSES
/**
 * Represents a Map Position, though can be used for screen coordinates
 */
class Position {
	/**
	 * Constructor
	 * @param {number} [x=0] 		x position
	 * @param {number} [y=0] 		y position
	 * @param {number} [angle=0]	angle
	 */
	constructor(x = 0, y = 0, angle = 0) {
		this.x = x;
		this.y = y;
		this.angle = normalizeAngle(angle);
	}

	/**
	 * Add two positions, like adding vectors
	 * @param {Position} other	Other position
	 * @returns {Position}		New position
	 */
	add(other) {
		return new Position(
			this.x + other.x,
			this.y + other.y,
			this.angle + other.angle
		);
	}

	/**
	 * Add two positions, like adding vectors, but stores result in this position
	 * rather than creating a new one
	 * @param {Position} other	Other position
	 */
	addTo(other) {
		this.x += other.x;
		this.y += other.y;
		this.angle += other.angle;
	}

	/**
	 * Subtract another position, like subtracting vectors
	 * @param {Position} other	Other position
	 * @returns {Position}		New position
	 */
	subtract(other) {
		return new Position(
			this.x - other.x,
			this.y - other.y,
			this.angle - other.angle
		);
	}

	/**
	 * Adds an offset. Goes forward x units, up y units (rotated based on own direction), and then turns by angle
	 * @param {number} x			Moves forward this amount
	 * @param {number} y 			Moves up this amount
	 * @param {number} [angle=0]	Turn angle. By default doesn't turn
	 * @returns {Position}			New position
	 */
	addOffset(x, y, angle = 0) {
		const cos = Math.cos(this.angle);
		const sin = Math.sin(this.angle);

		return new Position(
			this.x + x * cos - y * sin,
			this.y + x * sin + y * cos,
			this.angle + angle
		);
	}

	/**
	 * Add an offset position. Goes forward other.x units and up other.y units rotated by direction, and then turns by other.angle
	 * @param {Position} other	Other position 
	 * @returns {Position}		New position
	 */
	addOffsetPos(other) {
		const cos = Math.cos(this.angle);
		const sin = Math.sin(this.angle);

		return new Position(
			this.x + other.x * cos - other.y * sin,
			this.y + other.x * sin + other.y * cos,
			this.angle + other.angle
		);
	}

	/**
	 * Get distance from (0, 0)
	 */
	get distance() {
		return Math.hypot(this.x, this.y);
	}

	/**
	 * Get angle from (0, 0)
	 */
	get direction() {
		return Math.atan2(this.y, this.x);
	}

	/**
	 * Get the angle from this to another position
	 * @param {Position} other	other position
	 * @returns {number}		angle to other position
	 */
	angleTo(other) {
		return normalizeAngle(
			Math.atan2(
				other.y - this.y,
				other.x - this.x
			)
		);
	}

	/**
	 * Get the distance from this to another position
	 * @param {Position} other	other position
	 * @returns {number}		distance to other position
	 */
	distanceTo(other) {
		return Math.hypot(
			other.y - this.y,
			other.x - this.x
		);
	}
}

/**
 * Stores a base weapon
 */
class Weapon {
	/**
	 * Constructor
	 * @param {string} id 												Id of weapon. Lowercase, no spaces
	 * @param {string} name 											Name of weapon
	 * @param {number} type 											From ProjectileType
	 * @param {{LOD0: Visual[], LOD1: Visual[], LOD2: Visual[]}} visual	Object with a LOD0/LOD1/LOD2 list of visuals
	 * @param {Object} [config={}] 										Extra info
	 */
	constructor(id, name, type, visual, config = {}) {
		this.id = id;
		this.name = name;
		this.type = type;
		this.visual = visual;

		weapons[id] = this;

		// CONFIG
		this.dmg = config.dmg ?? 1; // Damage (ignored for projectile weapons)
		this.ap = config.ap ?? 0;	// AP (ignored for projectile weapons)
		this.range = config.range ?? [10, 90, 100]; // Min/Effective/Max Range

		this.burst = config.burst ?? 1;				// Burst fire. Default is 1 at a time
		this.burstSpeed = config.burstSpeed ?? 1;	// Speed between burst shots in seconds
		this.shotCount = config.shotCount ?? 1;		// Number of shots when firing. Default is 1, higher produces shotgun effect

		this.reload = config.reload ?? 10; // Reload speed in seconds

		this.constant = config.constant ?? false; // Deals damage over time/constantly firing. Like flamethrower or area of effect
		// Can attack while moving. Melee weapons default true, ranged weapons default false
		this.fireWhileMoving = config.fireWhileMoving
			?? (type === WeaponType.MELEE ? true : false);
		this.targetsAllies = config.targetsAllies ?? false;
		if (config.lifeSteal)
			this.lifeSteal = config.lifeSteal;
		// If Projectile weapon
		this.projectile = config.projectile ?? undefined; // Projectile fired

		// If Area Weapon
		this.areaType = config.areaType;				// Area type if Area weapon
		this.areaRange = config.areaRange ?? 0;			// Area of effect range if Area
		this.areaAngle = config.areaAngle ?? 0;			// Area angle (used for Cone and for thickness of Line)

		/* Attack visual for non projectile weapons.
		 * Must accept params (x, y, tx, ty) for LINE/THRUST attacks
		 * Must accept params (x, y, angle) for CONE/SWING attacks
		 * Must accept params (x, y) for CIRCLE attacks
		 */
		this.atkVisual = config.atkVisual ?? undefined;
		this.fireVisual = config.fireVisual ?? undefined;

		const accuracy = (config.accuracy ?? 100) / 100; // Accuracy is between 0 - 1
		this.accuracy = config.accuracy ?? 100;
		this.spread = config.accuracy === 100 ? 0 : MAX_SPREAD * (1 - accuracy); // Spread is the calculated shot spread

		this.statusEffects = config.statusEffects ?? [];
	}

	/**
	 * Get full weapon tooltip
	 */
	get tooltip() {
		const projectile = this.projectile
			? (typeof this.projectile === "string"
				? projectiles[this.projectile]
				: this.projectile)
			: null;
		// Damage
		const damage = projectile?.dmg ?? this.dmg;
		const ap = projectile?.ap ?? this.ap;
		const lines = [];
		switch (this.type) {
			case WeaponType.PROJECTILE:
				lines.push(`Type: Projectile`);
				lines.push(`Projectile: ${projectile.name}`);
				switch (projectile.type) {
					case ProjectileType.MISSILE:
						lines.push(`Projectile Type: Missile`);
						break;
					case ProjectileType.PIERCE:
						lines.push(`Projectile Type: Piercing`);
						break;
					default:
						break;
				}
				lines.push(`Projectile Speed: ${projectile.speed}`);
				lines.push(`Range: ${this.range[0]} – ${this.range[2]}`);
				lines.push(`Accuracy: ${this.accuracy}`);
				break;
			case WeaponType.LASER:
				lines.push(`Type: Laser`);
				lines.push(`Range: ${this.range[0]} – ${this.range[2]}`);
				lines.push(`Accuracy: ${this.accuracy}`);
				break;
			case WeaponType.AREA:
				lines.push(`Type: Area of Effect`);
				switch (this.areaType) {
					case AreaType.CIRCLE:
						lines.push(`Target: Around Self`);
						lines.push(`Range: ${this.areaRange}`)
						break;
					case AreaType.CONE:
						lines.push(`Target: Cone`);
						lines.push(`Range: ${this.areaRange}`);
						lines.push(`Angle: ${radsToDegrees(this.areaAngle)}°`);
						break;
					case AreaType.LINE:
						lines.push(`Target: Line`);
						lines.push(`Range: ${this.areaRange}`);
						break;
				}
				break;
			case WeaponType.MELEE:
				lines.push(`Type: Melee`);
				switch (this.areaType) {
					case MeleeType.SWING:
						const deg = radsToDegrees(this.areaAngle);
						if (deg === 360)
							lines.push(`Target: Around Self`)
						else
							lines.push(`Target: Cone`);
						lines.push(`Range: ${this.areaRange}`)
						if (deg !== 360)
							lines.push(`Angle: ${radsToDegrees(this.areaAngle)}°`)
						break;
					case MeleeType.THRUST:
						lines.push(`Target: Single`);
						lines.push(`Range: ${this.range[0]} – ${this.range[2]}`);
						break;
				}
				break;
		}
		if (this.targetsAllies)
			lines.push(`Healing: ${-damage}`);
		else {
			lines.push(`Damage: ${damage}`);
			if (ap > 0)
				lines.push(`Armor Piercing: ${ap}`);
		}
		if (this.lifeSteal)
			lines.push(`Life Steal: ${Math.round(this.lifeSteal * 100)}%`);
		if (!this.constant)
			lines.push(`Reload: ${this.reload}s`);
		if (this.burst > 1)
			lines.push(`Burst: ${this.burst} (${this.burstSpeed}s)`)
		if (this.shotCount > 1)
			lines.push(`Shot Count: ${this.shotCount}`);
		if (this.statusEffects.length > 0) {
			const list = this.statusEffects.map(effect => StatusEffects[effect].name).join(', ');
			lines.push(`Status Effects: ${list}`);
		}
		if (this.fireWhileMoving) {
			if (this.type === WeaponType.MeleeType)
				lines.push("Attack While Moving");
			else lines.push("Fire While Moving");
		}
		if (this.constant)
			lines.push(`${damage < 0 ? "Healing" : "Damage"} Over Time`);

		return lines.join("\n");
	}
}

/**
 * Represents a base projectile
 */
class Projectile {
	/**
	 * Constructor
	 * @param {string} id 												Id of projectile. Lowercase, no spaces
	 * @param {string} name 											Name of projectile
	 * @param {number} type 											From ProjectileType
	 * @param {{LOD0: Visual[], LOD1: Visual[], LOD2: Visual[]}} visual	Object with a LOD0/LOD1/LOD2 list of visuals
	 * @param {Object} [config={}] 										Extra info
	 */
	constructor(id, name, type, visual, config = {}) {
		this.id = id;
		this.name = name;
		this.type = type;

		projectiles[id] = this;

		this.visual = visual;

		// CONFIG
		this.speed = config.speed ?? 10;	// Projectile speed
		this.dmg = config.dmg ?? 1; 		// Damage
		this.ap = config.ap ?? 0;			// Armor Piercing
		this.r = config.r ?? 0.5;			// Projectile Radius
		this.turnRate = config.turnRate ?? Math.PI / 4;

		// Area effects
		this.area = config.area ?? false;					// Does it have an area of effect upon hitting enemy?
		this.areaType = config.areaType ?? AreaType.CIRCLE;	// Circle: explosion, Cone: something like shrapnel continuing past it, Line: not really useful
		this.areaRange = config.areaRange ?? 0;				// Area of effect radius
		this.areaAngle = config.areaAngle ?? 0;				// Cone angle
	}
}

/**
 * Represents a weapon's location on a troop. Troops can have multiple of these,
 * allowing for a single unit to have multiple weapons firing independently
 */
class WeaponMount {
	/**
	 * Constructor
	 * @param {Weapon} weapon		Weapon
	 * @param {Object} [config={}]	Extra info
	 */
	constructor(weapon, config = {}) {
		this.weapon = weapon;
		// Offset from troop center
		this.x = config.x ?? 0;
		this.y = config.y ?? 0;

		// Offset from own start where the attack is launched from (projectile spawn point)
		this.px = config.px ?? 0;
		this.py = config.py ?? 0;

		// Default weapon orientation relative to troop
		this.angle = config.angle ?? 0;

		// Allowed rotation relative to default angle
		this.turnRange = config.turnRange ?? [-Math.PI, Math.PI];

		// Draw under the body of the troop, rather than above it
		this.under = config.under ?? false;
	}
}

/**
 * Represents a base troop/a template
 */
class TroopBase {
	/**
	 * Constructor
	 * @param {string} id 													Id of troop. Lowercase, no spaces
	 * @param {string} name 												Name of troop
	 * @param {{LOD0: Visual[], LOD1: Visual[], LOD2: Visual[]}[]} visual	List of all variants, each of which
	 * 																		is an object with a LOD0/LOD1/LOD2 version
	 * @param {Object} [config={}] 											Extra info
	 */
	constructor(id, name, visual, config = {}) {
		this.id = id;
		this.name = name;
		this.visual = visual;
		troops[id] = this;

		this.health = config.health ?? 10;		// Max health
		this.armor = config.armor ?? 1;			// Armor
		this.regen = config.regen ?? 0;			// Regenerate X hp/s
		this.weapons = config.weapons ?? [];	// Weapon mounts
		this.shield = config.shield ?? 0;
		this.shieldRegen = config.shieldRegen ?? 0;

		this.size = config.size ?? 5;					// Horizontal radius
		this.sizeY = config.sizeY ?? config.size ?? 5;	// Vertical Radius
		this.maxSize = Math.max(this.size, this.sizeY);
		this.speed = config.speed ?? 20;				// Move speed
		this.turnRate = config.turnRate ?? Math.PI;		// Turn speed
		this.static = config.static ?? false;			// Can it move/turn?

		/* Flying means:
		 * Drawn above map foreground
		 * Doesn't collide with non-flying troops/map objects
		 * Enemies can't target it with melee attacks unless also flying
		 */
		this.flying = config.flying ?? false;
		this.broadside = config.broadside ?? false; // Instead of facing enemy head on, faces enemy side on
		this.faceAllies = config.faceAllies ?? false; // Instead of facing enemy head on, faces allies head on

		// Base scale is used to calculate size when drawing squad/troop icon
		this.baseScale = config.baseScale ?? 40 / (this.maxSize * 2);

		this.moveVisual = config.moveVisual ?? undefined;
		this.moveOverrides = config.moveOverrides ?? false;
		this.dieVisual = config.dieVisual ?? undefined;
	}

	get flyingText() {
		return this.flying ? " (Flying)" : "";
	}

	get regenText() {
		return this.regen > 0 ? ` (${this.regen}/s)` : "";
	}

	get shieldText() {
		return this.shield > 0 ? ` + ${this.shield}` : "";
	}

	get armorText() {
		return `Armor reduces incoming damage based on armor minus the attack's armor piercing. Each point of effective armor reduces damage by 10% multiplicatively.\n\nThis troop has ${((1 - Math.pow(0.9, this.armor)) * 100).toFixed(1)}% damage reduction`;
	}

	/**
	 * Get radius of self from angle to this, since it can have a different x/y radius
	 * @param {number} angle    angle from
	 * @returns {number}        radius
	 */
	getDirectionalRadius(angle) {
		const cos = Math.cos(angle);
		const sin = Math.sin(angle);

		return Math.sqrt(
			this.size * this.size * cos * cos +
			this.sizeY * this.sizeY * sin * sin
		);
	}

	getDirectionalRadiusAngle(angle) {
		return this.getDirectionalRadius(angle)
	}

	/**
	 * Draw the basic troop, for UI
	 * @param {number} x 		center x
	 * @param {number} y 		center y
	 * @param {number[]} cols 	team colors
	 */
	drawBase(x, y, cols) {
		push();
		translate(x, y);
		scale(this.baseScale);
		// Under Weapons
		for (const mount of this.weapons) {
			if (!mount.under) continue;
			push();

			translate(mount.x, mount.y);
			rotate(mount.angle);

			for (const visual of mount.weapon.visual.LOD0) {
				visual.draw(0, 0, cols);
			}

			pop();
		}
		// Troop Body
		for (const visual of this.visual[0].LOD0) {
			visual.draw(0, 0, cols);
		}
		// Over Weapons
		for (const mount of this.weapons) {
			if (mount.under) continue;
			push();

			translate(mount.x, mount.y);
			rotate(mount.angle);

			for (const visual of mount.weapon.visual.LOD0) {
				visual.draw(0, 0, cols);
			}

			pop();
		}
		pop();
	}

	/**
	 * Not actual mass, but used for collisions finding who should be pushed aside
	 */
	get mass() {
		return this.size * this.sizeY;
	}
}

/**
 * Instance of a troop
 */
class Troop {

	/**
	 * Constructor
	 * @param {TroopBase} base 		base troop
	 * @param {number} x 			center x
	 * @param {number} y 			center y
	 * @param {boolean} playerOwned true if player owned, false if AI
	 * @param {number} angle 		initial angle
	 * @param {Mode} mode			game mode spawning it
	 */
	constructor(base, x, y, playerOwned, angle, mode) {
		this.name = `${base.name} ${playerOwned ? pi++ : ei++}`;
		this.base = base;
		this.variant = Math.floor(Math.random() * this.base.visual.length); // Get own variant graphics

		this.playerOwned = playerOwned;
		if (playerOwned) {
			mode.playerTroops.add(this);
		} else {
			mode.enemyTroops.add(this);
		}
		this.squad = null;

		// Position / orientation
		this.pos = new Position(constrain(x, this.base.size, MAP_W - this.base.size), constrain(y, this.base.sizeY, MAP_H - this.base.sizeY), angle);
		mode.grid.insert(this);
		this.moveLoc = undefined;
		this.moving = false;

		// Instance stats
		this.health = base.health;
		this.shield = base.shield;

		// Initialize weapons with the default mount, the reload/burst num, starting angle, target, visual, and if firing
		this.weapons = base.weapons.map(mount => ({
			mount: mount,
			reload: 0,
			burst: 0,
			angle: mount.angle,
			target: null,
			visual: null,
			firing: false // Only ever set true for constant DoT weapons
		}));
		this.maxRange = 0;
		for (const weapon of this.weapons) {
			if (weapon.mount.weapon.range[2] > this.maxRange)
				this.maxRange = weapon.mount.weapon.range[2];
		}
		this.calcArmor = this.base.armor;
		this.calcSpeed = this.base.speed;
		this.originalTeam = this.playerOwned;
		this.calcDMG = 1;
		this.statusEffects = [];
		this.moveTime = 0;
	}

	/**
	 * Draw self
	 */
	draw() {
		if (this.health <= 0)
			return;
		const cols = this.playerOwned ? TEAMS.PLAYER : TEAMS.ENEMY;
		if (this.moveVisual && !this.base.moveOverrides) {
			this.moveVisual.draw();
		}
		for (const weapon of this.weapons) {
			if (weapon.firing && weapon.visual) {
				weapon.visual.draw();
			}
		}
		// Don't draw if offscreen
		if (!camera.isInBounds(this.pos.x, this.pos.y, this.base.size))
			return;

		push();
		translate(this.pos.x, this.pos.y);
		rotate(this.pos.angle);

		// Weapons drawn under body
		for (const weapon of this.weapons) {
			const mount = weapon.mount;
			if (!mount.under)
				continue;
			// this.aimWeapon(weapon);
			push();

			translate(mount.x, mount.y);
			rotate(weapon.angle);
			for (const visual of mount.weapon.visual[camera.lod]) {
				visual.draw(0, 0, cols, this.moveTime);
			}

			pop();
		}
		// Troop body
		if (this.moving && this.base.moveOverrides) {
			for (const visual of this.base.moveVisual[this.variant][camera.lod]) {
				visual.draw(0, 0, cols, this.moveTime);
			}
		} else {
			for (const visual of this.base.visual[this.variant][camera.lod]) {
				visual.draw(0, 0, cols, this.moveTime);
			}
		}
		// Weapons drawn over body
		for (const weapon of this.weapons) {
			const mount = weapon.mount;
			if (mount.under)
				continue;
			// this.aimWeapon(weapon);
			push();

			translate(mount.x, mount.y);
			rotate(weapon.angle);
			for (const visual of mount.weapon.visual[camera.lod]) {
				visual.draw(0, 0, cols, this.moveTime);
			}

			pop();
		}
		pop();
		// Draw health bar if selected
		if (this.squad && this.squad == mode.selectedSquad || this.pos.distanceTo(mPos) <= this.getDirectionalRadius(mPos)) {
			const h = this.health / this.base.health;
			const tx = this.pos.x - this.base.size;
			const ty = this.pos.y + this.base.size + 2;
			const wide = this.base.size * 2;
			push();
			stroke(255);
			strokeWeight(2);
			fill(255, 0, 0);
			rect(tx, ty, wide, 4);
			strokeWeight(0);
			rect(tx, ty, wide, 4);
			fill(0, 255, 0);
			rect(tx, ty, wide * h, 4);
			if (this.base.shield > 0 && this.shield > 0) {
				fill(150, 194, 224);
				rect(tx, ty, wide * this.shield / this.base.shield, 1);
			}
			pop();
		}
	}

	/**
	 * Get radius of self from position's angle to this, since it can have a different x/y radius
	 * @param {Position} pos    position of object
	 * @returns {number}        radius
	 */
	getDirectionalRadius(pos) {
		return this.base.getDirectionalRadius(normalizeAngle(pos.angleTo(this.pos) - this.pos.angle))
	}

	/**
	 * Run own move/AI code. Uses dt to determine how much time has passed/how much it should move/etc
	 * @param {number} dt	delta time in seconds
	 */
	tick(dt) {
		if (this.health <= 0)
			return;
		this.moveTime += dt;
		// Heal if has regen
		this.health += dt * this.base.regen;
		if (this.health > this.base.health)
			this.health = this.base.health;
		this.shield += dt * this.base.shieldRegen;
		if (this.shield > this.base.shield)
			this.shield = this.base.shield;
		const awake = this.processStatusEffects(dt);
		if (!awake) return;
		// Move self
		this.moving = this.move(dt);
		if (this.moving && this.base.moveVisual && !this.base.moveOverrides) {
			if (!this.moveVisual) {
				this.moveVisual = this.base.moveVisual(this.pos.x, this.pos.y, this.pos.angle);
				this.moveVisual.timeElapsed = -dt;
				this.moveVisual.under = true;
			}
			this.moveVisual.x = this.pos.x;
			this.moveVisual.y = this.pos.y;
			this.moveVisual.a = this.pos.angle;
			this.moveVisual.timeElapsed += dt;
			this.moveVisual.time = dt + this.moveVisual.maxTime;
		} else if (this.moveVisual) {
			this.moveVisual.timeElapsed += dt;
			this.moveVisual.under = false;
			this.moveVisual = null;
		}

		// Change grid cell if needed
		const newCellIndex = mode.grid.getCellIndex(
			this.pos.x,
			this.pos.y
		);
		if (newCellIndex != this.gridIndex) {
			if (this.gridIndex >= 0) {
				const oldCell = mode.grid.cells[this.gridIndex];
				if (oldCell) {
					const i = oldCell.indexOf(this);
					if (i >= 0)
						oldCell.splice(i, 1);
				}
			}
			if (newCellIndex >= 0) {
				mode.grid.insertIndex(this, newCellIndex);
			}
			this.gridIndex = newCellIndex;
		}

		// End if we've swapped modes because battle ended
		if (!mode.grid)
			return;

		// Get all potential targets
		const searchArr = mode.grid.query(this.pos.x, this.pos.y, this.maxRange);

		// Handle each weapon
		for (const weapon of this.weapons) {
			weapon.reload -= dt;
			if (weapon.visual && weapon.firing) { // Constant weapon TemporaryVisuals don't fade while firing
				weapon.visual.time = weapon.visual.maxTime + dt;
			}
			if (weapon.firing) { // If firing, adjust the constant visual to match the target if they've moved
				const position = this.getWeaponProjectilePosition(weapon);
				const angle = normalizeAngle(
					position.angle + weapon.angle
				);
				weapon.visual.x = position.x;
				weapon.visual.y = position.y;
				weapon.visual.direction = angle;
				const baseWeapon = weapon.mount.weapon;
				let keepDoT = this.checkTarget(weapon, weapon.target)
				if (!keepDoT) { // If no longer has a target in range and can't get one
					keepDoT = this.getTarget(weapon, baseWeapon, searchArr);
					if (!keepDoT) {
						weapon.firing = false;
						if (weapon.visual) {
							mode.temporaryVisuals.delete(weapon.visual);
							weapon.visual = null;
						}
						weapon.reload = weapon.mount.weapon.reload;
					}
				}
				if (keepDoT) {
					switch (baseWeapon.areaType) {
						case AreaType.CIRCLE: // Hit all targets in circle
							for (const target of searchArr) {
								if (target.health <= 0 || target.playerOwned === (baseWeapon.targetsAllies ? !this.playerOwned : this.playerOwned)) continue;
								const dst = position.distanceTo(target.pos);
								const maxRange = baseWeapon.areaRange + target.getDirectionalRadius(position);
								if (dst <= maxRange) {
									damageTroop(this, target, baseWeapon.dmg * dt, baseWeapon.ap, baseWeapon, false);
								}
							}
							break;
						case AreaType.CONE: // Hit all targets in cone
							const halfAngle = baseWeapon.areaAngle / 2;
							const cosHalfAngle = Math.cos(halfAngle);
							let hitTg = false;
							for (const target of searchArr) {
								if (target.health <= 0 || target.playerOwned === (baseWeapon.targetsAllies ? !this.playerOwned : this.playerOwned)) continue;
								const difference = target.pos.subtract(position);
								const dst = difference.distance;

								const maxRange = baseWeapon.areaRange + target.getDirectionalRadius(position);

								if (dst > maxRange) continue;

								const dot =
									Math.cos(difference.direction - position.angle);

								if (dot >= cosHalfAngle) {
									if (target == weapon.target)
										hitTg = true;
									damageTroop(this, target, baseWeapon.dmg * dt, baseWeapon.ap, baseWeapon, false);
								}
							}
							if (!hitTg)
								damageTroop(this, weapon.target, baseWeapon.dmg * dt, baseWeapon.ap, baseWeapon, false);
							break;
						case AreaType.LINE: // Hit targets in straight line
							const tPos = weapon.target.pos;
							const dx = tPos.x - position.x;
							const dy = tPos.y - position.y;
							const worldAngle = Math.atan2(dy, dx);
							const rad = weapon.target.getDirectionalRadius(position)
							weapon.visual.tx = tPos.x - rad * Math.cos(worldAngle);
							weapon.visual.ty = tPos.y - rad * Math.sin(worldAngle);
							let hitlTg = false;
							for (const target of searchArr) {
								if (target.health <= 0 || target.playerOwned === (baseWeapon.targetsAllies ? !this.playerOwned : this.playerOwned)) continue;
								const dx = weapon.visual.tx - position.x;
								const dy = weapon.visual.ty - position.y;
								const lenSq = dx * dx + dy * dy;
								let t = 0;
								if (lenSq !== 0) {
									t = ((target.pos.x - position.x) * dx + (target.pos.y - position.y) * dy) / lenSq;
								}
								t = Math.max(0, Math.min(1, t));
								const closestX = position.x + t * dx;
								const closestY = position.y + t * dy;
								const pt = new Position(closestX, closestY);
								if (pt.distanceTo(target.pos) < target.getDirectionalRadius(pt)) {
									damageTroop(this, target, baseWeapon.dmg * dt, baseWeapon.ap, baseWeapon, false);
									if (target == weapon.target)
										hitlTg = true;
								}
							}
							if (!hitlTg) {
								damageTroop(this, weapon.target, baseWeapon.dmg * dt, baseWeapon.ap, baseWeapon, false);
							}
							break;
					}
				}
			}
			// If that damage was enough to end battle, return
			if (mode instanceof Menu)
				return;
			this.runWeaponAI(weapon, searchArr); // Run weapon AI
		}
		// Turn to face nearest enemy in range
		if (!this.moveLoc && !(mode instanceof Menu)) {
			this.turnToEnemy(dt, searchArr);
		}
	}

	/**
	 * Move towards this.moveLoc
	 * @param {number} dt	delta time in seconds
	 * @returns {boolean}	if moving
	 */
	move(dt) {
		if (this.base.static) // Can't move if static
			return false;
		if (!this.moveLoc) { // Can't move if not moving towards something
			return false;
		}

		const difference = this.moveLoc.subtract(this.pos);
		const moveAngle = difference.direction;
		const distance = difference.distance;

		const rotation = this.base.turnRate * (this.calcSpeed / this.base.speed) * dt;
		const movement = this.calcSpeed * dt;

		// Turn toward movement direction first
		const angleDifference = normalizeAngle(
			moveAngle - this.pos.angle
		);

		if (Math.abs(angleDifference) > rotation) {
			this.pos.angle = normalizeAngle(
				this.pos.angle +
				Math.sign(angleDifference) * rotation
			);
			return true;
		}

		// Finish turning
		this.pos.angle = moveAngle;

		// Calculate overlaps
		let canMoveTo = true;
		let dx = Math.cos(moveAngle) * movement;
		let dy = Math.sin(moveAngle) * movement;
		let newPos = new Position(this.pos.x + dx, this.pos.y + dy);
		const searchArr = mode.grid.query(this.pos.x, this.pos.y, Math.max(this.base.size, this.base.sizeY) * 4);
		for (const trp of searchArr) {
			if (trp.squad === this.squad || this.base.flying !== trp.base.flying)
				continue;
			// Run this quicker check before running the more expensive math
			const qdx = newPos.x - trp.pos.x;
			const qdy = newPos.y - trp.pos.y;
			const minDist = this.base.maxSize + trp.base.maxSize;
			const dst = qdx * qdx + qdy * qdy;
			if (dst >= minDist * minDist) {
				continue;
			}
			// More expensive math
			if (Math.sqrt(dst) <
				this.getDirectionalRadius(trp.pos) +
				trp.getDirectionalRadius(this.pos)) {
				// Push smaller unit or go around
				const myMass = this.base.mass;
				const theirMass = trp.base.mass;
				if (myMass > theirMass && !trp.base.static) {
					// Push the smaller unit.
					const massRatio = myMass / theirMass;
					const push = movement * Math.min(massRatio - 1, 2);
					const angleDiff = (this.pos.angleTo(trp.pos) - moveAngle) * 1.5;
					if (!trp.moveLoc) {
						trp.moveLoc = new Position(trp.pos.x, trp.pos.y, trp.pos.angle);
					}
					trp.pos.x += Math.cos(moveAngle + angleDiff) * push + 1;
					trp.pos.y += Math.sin(moveAngle + angleDiff) * push + 1;

					// Recalculate after pushing.
					newPos = new Position(
						this.pos.x + dx,
						this.pos.y + dy
					);
				} else {
					// Troop isn't big enough to push it/other troop is static so it goes around
					const overlaps = findCircleIntersections(
						this.pos,
						movement,
						trp.pos,
						this.base.size + trp.base.size
					);

					if (overlaps.length > 0) {
						newPos = this.pos;

						for (const pt of overlaps) {
							if (pt.distanceTo(this.moveLoc) < newPos.distanceTo(this.moveLoc)) {
								newPos = pt;
							}
						}

						const diff = newPos.subtract(this.pos);
						dx = diff.x;
						dy = diff.y;
					}
				}
			}
			// Can't move to destination if destination is filled by other unit
			if (this.moveLoc.distanceTo(trp.pos) < this.getDirectionalRadius(trp.pos) + trp.getDirectionalRadius(this.moveLoc)) {
				canMoveTo = false;
			}
		}
		// If not a flying unit, consider map collisions as well
		if (!this.base.flying) {
			const mapSearchArr = mode.map.grid.query(this.pos.x, this.pos.y, Math.max(this.base.size, this.base.sizeY) * 4);
			for (const mpobj of mapSearchArr) {
				if (!mpobj.solid)
					continue;
				if (newPos.distanceTo(mpobj.pos) < this.getDirectionalRadius(mpobj.pos) + mpobj.getDirectionalRadius(this.pos)) {
					const overlaps = findCircleIntersections(this.pos, movement, mpobj.pos, this.base.size + mpobj.size);
					if (overlaps.length > 0) {
						newPos = this.pos;
						for (const pt of overlaps) {
							if (pt.distanceTo(this.moveLoc) < newPos.distanceTo(this.moveLoc)) {
								newPos = pt;
							}
						}
						let diff = newPos.subtract(this.pos);
						dx = diff.x;
						dy = diff.y;
					}
				}
				if (this.moveLoc.distanceTo(mpobj.pos) < this.getDirectionalRadius(mpobj.pos) + mpobj.getDirectionalRadius(this.moveLoc)) {
					canMoveTo = false;
				}
			}
		}

		// Move to end if it can
		if (distance <= movement) {
			if (canMoveTo) {
				this.pos.x = this.moveLoc.x;
				this.pos.y = this.moveLoc.y;
				this.moveLoc = undefined;
			}
			// this.moveTime = 0;
			return false;
		}
		// otherwise just move as far as it can
		this.pos.x = newPos.x;
		this.pos.y = newPos.y;
		// this.moveTime += dt;
		return true;
	}

	/**
	 * An instance weapon mount
	 * @typedef {Object} TroopWeapon
	 * @property {WeaponMount} mount
	 * @property {number} reload
	 * @property {number} burst
	 * @property {number} angle
	 * @property {Troop} target
	 * @property {TemporaryVisual} visual
	 * @property {boolean} firing
	 */

	/**
	 * Run the weapon's AI
	 * @param {TroopWeapon} weapon		weapon from this.weapons
	 * @param {Troop[]} searchArr		passed to getTarget 
	 */
	runWeaponAI(weapon, searchArr) {
		// If we're dead, stop running. Probably not needed
		if (this.health <= 0)
			return;
		const baseWeapon = weapon.mount.weapon;
		if (this.moveLoc && !baseWeapon.fireWhileMoving) {
			return;
		}

		// If we don't have a valid target, try to get a valid target
		if (!weapon.target || weapon.target.health == 0 || !this.checkTarget(weapon, weapon.target)) {
			weapon.target = null;
			this.getTarget(weapon, baseWeapon, searchArr);
			// If we couldn't find a valid target and this is a constant DoT weapon, stop firing
			if (weapon.firing && !weapon.target) {
				weapon.firing = false;
				if (weapon.visual) {
					mode.temporaryVisuals.delete(weapon.visual);
					weapon.visual = null;
				}
				weapon.reload = weapon.mount.weapon.reload;
			}
			return;
		}

		// If not reloaded or constant weapon is still firing
		if (weapon.reload > 0 || weapon.firing) {
			return;
		}

		// Fire
		this.fireWeapon(weapon);
	}

	/**
	 * Point weapon at target
	 * @param {TroopWeapon} weapon weapon from this.weapons
	 */
	aimWeapon(weapon) {
		// If no target return
		if (!weapon.target) return;
		// Otherwise point at target

		const mount = weapon.mount;
		const weaponPos = this.getWeaponPosition(weapon);

		const dx = weapon.target.pos.x - weaponPos.x;
		const dy = weapon.target.pos.y - weaponPos.y;
		const worldAngle = Math.atan2(dy, dx);

		// Target angle relative to the troop
		const relativeAngle = normalizeAngle(
			worldAngle - this.pos.angle
		);

		// Weapon's allowed absolute angle relative to the troop
		const minAngle =
			mount.angle + mount.turnRange[0];

		const maxAngle =
			mount.angle + mount.turnRange[1];

		// For normal non-wrapping arcs
		weapon.angle = normalizeAngle(constrain(
			relativeAngle,
			minAngle,
			maxAngle
		));
	}

	/**
	 * Fire weapon
	 * @param {TroopWeapon} weapon weapon from this.weapons
	 */
	fireWeapon(weapon) {
		const baseWeapon = weapon.mount.weapon;
		// Stop firing if no target
		if (!weapon.target) {
			weapon.burst = 0;
			weapon.reload = baseWeapon.reload;
			return;
		}
		// Fire shot
		weapon.burst++;
		if (weapon.burst >= baseWeapon.burst) { // Once burst over, set to reload time
			weapon.burst = 0;
			weapon.reload = baseWeapon.reload;
		} else { // Otherwise set to burst reload time
			weapon.reload = baseWeapon.burstSpeed;
		}

		// If damage over time weapon, set firing = true
		if (baseWeapon.constant) {
			weapon.firing = true;
		}
		if (weapon.visual) {
			mode.temporaryVisuals.delete(weapon.visual);
		}

		// Get origin of fire
		const position = this.getWeaponProjectilePosition(weapon);

		// Get all possible targets (if needed)
		let searchArr;
		if (baseWeapon.type !== WeaponType.PROJECTILE)
			searchArr = mode.grid.query(position.x, position.y, baseWeapon.range[2]);
		switch (baseWeapon.type) {
			case WeaponType.MELEE:
				const wPos = this.getWeaponPosition(weapon);
				switch (baseWeapon.areaType) {
					case MeleeType.THRUST: // Hit own target
						const tPos = weapon.target.pos;
						const dx = tPos.x - wPos.x;
						const dy = tPos.y - wPos.y;
						const worldAngle = Math.atan2(dy, dx);
						const rad = weapon.target.getDirectionalRadius(position)
						const tx = tPos.x - rad * Math.cos(worldAngle);
						const ty = tPos.y - rad * Math.sin(worldAngle);
						baseWeapon.atkVisual(position.x, position.y, tx, ty);
						damageTroop(this, weapon.target, baseWeapon.dmg, baseWeapon.ap, baseWeapon);
						break;
					case MeleeType.SWING: // Hit targets in cone
						const halfAngle = baseWeapon.areaAngle / 2;
						const cosHalfAngle = Math.cos(halfAngle);
						let hitTg = false;
						for (const target of searchArr) {
							if (target.health <= 0 || target.playerOwned === (baseWeapon.targetsAllies ? !this.playerOwned : this.playerOwned) || target.base.flying && !this.base.flying) continue;

							const difference = target.pos.subtract(this.pos);
							const dst = difference.distance;
							const maxRange = baseWeapon.areaRange + target.getDirectionalRadius(position);

							if (dst > maxRange) continue;

							const dot =
								Math.cos(difference.direction - wPos.angle);

							if (dot >= cosHalfAngle) {
								if (target == weapon.target)
									hitTg = true;
								damageTroop(this, target, baseWeapon.dmg, baseWeapon.ap, baseWeapon);
							}
						}
						if (!hitTg)
							damageTroop(this, weapon.target, baseWeapon.dmg, baseWeapon.ap, baseWeapon);
						weapon.visual = baseWeapon.atkVisual(wPos.x, wPos.y, wPos.angle);
						break;
				}
				break;
			case WeaponType.PROJECTILE: // Fire off projectile(s)
				const count = 'shotCount' in baseWeapon ? baseWeapon.shotCount : 1;
				if (count > 1) {
					const variance = baseWeapon.projectile.r * 4;
					for (let i = 0; i < count; i++) {
						const random = Math.random();
						const random2 = Math.random();
						const shotAngle = normalizeAngle(position.angle + (random * 2 - 1) * baseWeapon.spread * 5);
						new ProjectileInstance(position.x + ((random * 2 * variance) - variance), position.y + ((random2 * 2 * variance) - variance), shotAngle, baseWeapon.projectile, baseWeapon.targetsAllies ? !this.playerOwned : this.playerOwned, baseWeapon.range[2], this, weapon.target, baseWeapon);
					}
				} else {
					const shotAngle = baseWeapon.projectile.type == ProjectileType.MISSILE
						? normalizeAngle(weapon.mount.angle + this.pos.angle)
						: normalizeAngle(position.angle + (Math.random() * 2 - 1) * baseWeapon.spread);
					new ProjectileInstance(position.x, position.y, shotAngle, baseWeapon.projectile, baseWeapon.targetsAllies ? !this.playerOwned : this.playerOwned, baseWeapon.range[2], this, weapon.target, baseWeapon);
				}
				if (baseWeapon.fireVisual)
					baseWeapon.fireVisual(position.x, position.y, position.angle);
				break;
			case WeaponType.LASER: // Fire laser with any potential spread
				position.angle = normalizeAngle(position.angle + (Math.random() * 2 - 1) * baseWeapon.spread);
				const hit = getLaserTarget(position, position.angle, searchArr, baseWeapon.range[2], baseWeapon.targetsAllies ? !this.playerOwned : this.playerOwned);
				let hitPos = position.addOffset(baseWeapon.range[2], 0, 0);
				const dx = Math.cos(position.angle);
				const dy = Math.sin(position.angle);
				if (hit) {
					const tx = hit.pos.x - position.x;
					const ty = hit.pos.y - position.y;

					// Distance along the laser to the target center
					const along = tx * dx + ty * dy;

					// Perpendicular distance from the target center to the laser
					const perpendicular = Math.abs(tx * dy - ty * dx);

					// Distance from the target center to the intersection point
					const rad = hit.getDirectionalRadius(position);
					const offset = Math.sqrt(
						rad * rad -
						perpendicular * perpendicular
					);

					// Distance from the laser origin to the near edge
					const hitDistance = along - offset;

					hitPos = new Position(
						position.x + dx * hitDistance,
						position.y + dy * hitDistance
					);
					damageTroop(this, hit, baseWeapon.dmg, baseWeapon.ap, baseWeapon);
				}
				baseWeapon.atkVisual(
					position.x,
					position.y,
					hitPos.x,
					hitPos.y
				);
				if (baseWeapon.fireVisual)
					baseWeapon.fireVisual(position.x, position.y, position.angle);
				break;
			case WeaponType.AREA: // Hit targets in area for full damage
				switch (baseWeapon.areaType) {
					case AreaType.CIRCLE:
						for (const target of searchArr) {
							if (target.health <= 0
								|| ((baseWeapon.targetsAllies && target.playerOwned !== this.playerOwned)
				 					|| (!baseWeapon.targetsAllies && target.playerOwned === this.playerOwned))) continue;
							const dst = this.pos.distanceTo(target.pos);
							const maxRange = baseWeapon.areaRange + target.getDirectionalRadius(position);
							if (dst <= maxRange) {
								damageTroop(this, target, baseWeapon.dmg, baseWeapon.ap, baseWeapon);
							}
						}
						weapon.visual = baseWeapon.atkVisual(position.x, position.y);
						weapon.visual.under = true;
						break;
					case AreaType.CONE:
						const halfAngle = baseWeapon.areaAngle / 2;
						const cosHalfAngle = Math.cos(halfAngle);
						let hitTg = false;
						for (const target of searchArr) {
							if (target.health <= 0
								|| ((baseWeapon.targetsAllies && target.playerOwned !== this.playerOwned)
				 					|| (!baseWeapon.targetsAllies && target.playerOwned === this.playerOwned))) continue;

							const difference = target.pos.subtract(this.pos);
							const dst = difference.distance;
							const maxRange = baseWeapon.areaRange + target.getDirectionalRadius(position);

							if (dst > maxRange) continue;

							const dot =
								Math.cos(difference.direction - position.angle);

							if (dot >= cosHalfAngle) {
								if (target == weapon.target)
									hitTg = true;
								damageTroop(this, target, baseWeapon.dmg, baseWeapon.ap, baseWeapon);
							}
						}
						if (!hitTg)
							damageTroop(this, weapon.target, baseWeapon.dmg, baseWeapon.ap, baseWeapon);
						weapon.visual = baseWeapon.atkVisual(position.x, position.y, position.angle);
						if (baseWeapon.fireVisual)
							baseWeapon.fireVisual(position.x, position.y, position.angle);
						break;
					case AreaType.LINE:
						const tPos = weapon.target.pos;
						const dx = tPos.x - position.x;
						const dy = tPos.y - position.y;
						const worldAngle = Math.atan2(dy, dx);
						const rad = weapon.target.getDirectionalRadius(position)
						const tx = tPos.x - rad * Math.cos(worldAngle);
						const ty = tPos.y - rad * Math.sin(worldAngle);
						weapon.visual = baseWeapon.atkVisual(position.x, position.y, tx, ty);
						let hitTgl = false;
						for (const target of searchArr) {
							if (target.health <= 0
								|| ((baseWeapon.targetsAllies && target.playerOwned !== this.playerOwned)
				 					|| (!baseWeapon.targetsAllies && target.playerOwned === this.playerOwned))) continue;
							const dx = tx - position.x;
							const dy = ty - position.y;
							const lenSq = dx * dx + dy * dy;
							let t = 0;
							if (lenSq !== 0) {
								t = ((target.pos.x - position.x) * dx + (target.pos.y - position.y) * dy) / lenSq;
							}
							t = Math.max(0, Math.min(1, t));
							const closestX = position.x + t * dx;
							const closestY = position.y + t * dy;
							const pt = new Position(closestX, closestY);
							if (pt.distanceTo(target.pos) < target.getDirectionalRadius(pt)) {
								damageTroop(this, target, baseWeapon.dmg, baseWeapon.ap, baseWeapon);
								if (target == weapon.target)
									hitTgl = true;
							}
						}
						if (!hitTgl)
							damageTroop(this, weapon.target, baseWeapon.dmg, baseWeapon.ap, baseWeapon);
						if (baseWeapon.fireVisual)
							baseWeapon.fireVisual(position.x, position.y, position.angle);
						break;
				}
				break;
		}
	}

	/**
	 * Get closest target for weapon
	 * @param {TroopWeapon} weapon			weapon from this.weapons
	 * @param {Weapon} baseWeapon 			base weapon
	 * @param {Troop[]} [searchArr=null]	array to search, can save us a query
	 * @returns {Troop}			  			new target
	 */
	getTarget(weapon, baseWeapon, searchArr=null) {
		if (!searchArr)
			searchArr = mode.grid.query(this.pos.x, this.pos.y, baseWeapon.range[2]);
		let closest = undefined;
		let bestValue = baseWeapon.targetsAllies ? -1 : Infinity;

		if (!baseWeapon.targetsAllies) {
			for (const target of searchArr) {
				if (target.playerOwned === this.playerOwned || !this.checkTarget(weapon, target)) {
					continue;
				}
				const dx = target.pos.x - this.pos.x;
				const dy = target.pos.y - this.pos.y;
				const distanceSq = dx * dx + dy * dy;
				if (distanceSq < bestValue || (closest.squad !== this.squad?.attack && target.squad === this.squad?.attack)) {
					bestValue = distanceSq;
					closest = target;
				}
			}
		} else {
			for (const target of searchArr) {
				if (target.playerOwned !== this.playerOwned || !this.checkTarget(weapon, target)) {
					continue;
				}
				const value = ((target.base.health - target.health) / target.base.health) * target.squad.base.curPer;
				if (value > bestValue || (closest.squad !== this.squad?.attack && target.squad === this.squad?.attack)) {
					bestValue = value;
					closest = target;
				}
			}
		}

		weapon.target = closest;
		return closest;
	}

	/**
	 * Check if a target is valid
	 * @param {TroopWeapon} weapon	weapon from this.weapons
	 * @param {Troop} target 		troop to check
	 * @returns {boolean}			if valid target
	 */
	checkTarget(weapon, target) {
		if (!target || target.health <= 0 || (target.playerOwned === this.playerOwned && !weapon.mount.weapon.targetsAllies))
			return false;

		const mount = weapon.mount;
		const baseWeapon = mount.weapon;
		if (baseWeapon.targetsAllies && target.health >= target.base.health)
			return false;
		// Flying enemies can't be targeted by melee unless unit also flies
		if (
			baseWeapon.type == WeaponType.MELEE &&
			target.base.flying &&
			!this.base.flying
		) {
			return false;
		}

		const weaponPos = this.getWeaponPosition(weapon);

		const dx = target.pos.x - weaponPos.x;
		const dy = target.pos.y - weaponPos.y;

		const distance = Math.hypot(dx, dy);

		// Outside weapon range
		if (
			distance + target.getDirectionalRadius(weaponPos) < baseWeapon.range[0] + this.getDirectionalRadius(target.pos) ||
			distance - target.getDirectionalRadius(weaponPos) > baseWeapon.range[2] + this.getDirectionalRadius(target.pos)
		) {
			return false;
		}

		const targetAngle = Math.atan2(dy, dx);

		// Target angle relative to the troop
		const relativeAngle = normalizeAngle(
			targetAngle - this.pos.angle
		);

		// Angular size of the target as seen from the weapon
		const targetAngleSize = Math.asin(
			Math.min(1, target.getDirectionalRadius(weaponPos) / distance)
		);

		const [minAngle, maxAngle] = this.getWeaponAngleRange(weapon);

		// Check whether any part of the target overlaps
		// the weapon's firing arc.
		if (!angleRangeIntersectsTarget(
			minAngle,
			maxAngle,
			relativeAngle,
			targetAngleSize
		)) {
			return false;
		}
		weapon.angle = normalizeAngle(constrain(
			relativeAngle,
			minAngle,
			maxAngle
		));
		return true;
	}

	/**
	 * Gets the angle range
	 * @param {TroopWeapon} weapon	weapon from this.weapons
	 * @returns {number[]} 			range
	 */
	getWeaponAngleRange(weapon) {
		const mount = weapon.mount;

		return [
			normalizeAngle(mount.angle + mount.turnRange[0]),
			normalizeAngle(mount.angle + mount.turnRange[1])
		];
	}

	/**
	 * Get position of the weapon mount
	 * @param {TroopWeapon} weapon	weapon from this.weapons
	 * @returns {Position} 			position
	 */
	getWeaponPosition(weapon) {
		const mount = weapon.mount;
		return this.pos.addOffset(mount.x, mount.y, weapon.angle);
	}

	/**
	 * Get position of where the weapon mount fires from
	 * @param {TroopWeapon} weapon	weapon from this.weapons
	 * @returns {Position} 			position
	 */
	getWeaponProjectilePosition(weapon) {
		const mount = weapon.mount;

		const weaponPosition = this.pos.addOffset(
			mount.x,
			mount.y,
			weapon.angle
		);

		return weaponPosition.addOffset(
			mount.px,
			mount.py
		);
	}

	/**
	 * Troop turns to face nearest enemy in range if not static
	 * @param {number} dt			delta time in seconds
	 * @param {Troop[]} searchArr	array to search
	 */
	turnToEnemy(dt, searchArr) {
		if (this.base.static)
			return;
		if (searchArr.length === 0)
			return;

		let nearest = undefined;
		let nearestDistance = this.base.faceAllies ? -1 : Infinity;

		if (!this.base.faceAllies) {
			for (const enemy of searchArr) {
				if (enemy.health <= 0 || enemy.playerOwned === this.playerOwned)
					continue;

				const dx = enemy.pos.x - this.pos.x;
				const dy = enemy.pos.y - this.pos.y;
				const distance = dx * dx + dy * dy;

				if (distance < nearestDistance || nearest.squad !== this.squad.attack && enemy.squad === this.squad.attack) {
					nearestDistance = distance;
					nearest = enemy;
				}
			}
		} else {
			for (const enemy of searchArr) {
				if (enemy.health >= enemy.base.health || enemy.playerOwned === !this.playerOwned || enemy.squad === this.squad)
					continue;
				const value = ((enemy.base.health - enemy.health) / enemy.base.health) * enemy.squad.base.curPer;
				const dx = enemy.pos.x - this.pos.x;
				const dy = enemy.pos.y - this.pos.y;
				const distance = dx * dx + dy * dy;

				if (distance < this.maxRange && (value > nearestDistance || (nearest.squad !== this.squad.attack && enemy.squad === this.squad.attack))) {
					nearestDistance = value;
					nearest = enemy;
				}
			}
		}

		if (!nearest)
			return;

		const dx = nearest.pos.x - this.pos.x;
		const dy = nearest.pos.y - this.pos.y;

		let targetAngle = Math.atan2(dy, dx);
		if (this.base.broadside) {
			const left = normalizeAngle(targetAngle + Math.PI / 2);
			const right = normalizeAngle(targetAngle - Math.PI / 2);
			const leftDiff = Math.abs(normalizeAngle(left - this.pos.angle));
			const rightDiff = Math.abs(normalizeAngle(right - this.pos.angle));
			targetAngle = leftDiff < rightDiff ? left : right;
		}
		const angleDifference = normalizeAngle(
			targetAngle - this.pos.angle
		);


		const rotation = this.base.turnRate * dt;

		if (Math.abs(angleDifference) <= rotation) {
			this.pos.angle = targetAngle;
		} else {
			this.pos.angle = normalizeAngle(
				this.pos.angle +
				Math.sign(angleDifference) * rotation
			);
		}
	}

	/**
	 * Inflicts status effect on self
	 * @param {number} effect			effect being inflicted, drawn from StatusTypes
	 * @param {Troop} inflictor			person causing effect
	 * @param {boolean} [newStack=true]	should it inflict a new stack (assuming none) or just maintain an existing one?
	 */
	inflictStatusEffect(effect, inflictor, newStack=true) {
		const baseEffect = StatusEffects[effect];
		if (!baseEffect) return;
		let firstNull = -1;
		if (this.statusEffects.length > 0) {
			for (let i = 0; i < this.statusEffects.length; i++) {
				const statusEffect = this.statusEffects[i];
				if (!statusEffect) {
					if (firstNull < 0) firstNull = i;
					continue;
				}
				if (statusEffect.type === effect) {
					if (newStack) statusEffect.stacks = Math.min(baseEffect.maxStack, statusEffect.stacks + 1);
					statusEffect.time = baseEffect.time;
					return;
				}
			}
		}
		const newEffect = {
			type: effect,
			time: baseEffect.time,
			stacks: 1,
			inflictor: inflictor
		};
		if (firstNull >= 0)
			this.statusEffects[firstNull] = newEffect;
		else
			this.statusEffects.push(newEffect);
		return;
	}

	/**
	 * Process status effects on self
	 * @param {number} dt	change in time
	 * @returns {boolean}	false if the troop shouldn't act this turn. Otherwise true
	 */
	processStatusEffects(dt) {
		this.calcArmor = this.base.armor;
		this.calcSpeed = this.base.speed;
		this.calcDMG = 1;
		let awake = true;
		for (let i = 0; i < this.statusEffects.length; i++) {
			const effect = this.statusEffects[i];
			if (!effect)
				continue;
			if (effect.time < 0) {
				if (effect.type === StatusType.CHARMED) {
					this.playerOwned = this.originalTeam;
				}
				this.statusEffects[i] = null;
				continue;
			}
			const activeTime = Math.min(dt, effect.time);
			const timeScale = activeTime / dt;
			switch (effect.type) {
				case StatusType.POISON: // Damage over time effects
				case StatusType.BLEED:
					damageTroop(effect.inflictor, this, StatusEffects[effect.type].dmg * effect.stacks * activeTime, 0, null, false);
					break;
				case StatusType.SLOW:	// Slow/Speed effects
					this.calcSpeed -= this.base.speed * StatusEffects[effect.type].speed * effect.stacks * timeScale;
					break;
				case StatusType.SLEEP:
					awake = false;
					break;
				case StatusType.CHARMED:
					this.playerOwned = !this.originalTeam
					break;
				case StatusType.STRENGTHEN:	// Damage affecting effects
				case StatusType.WEAKEN:
					this.calcDMG += StatusEffects[effect.type].dmg * effect.stacks * timeScale;
					break;
				case StatusType.TOUGHEN:	// Armor affecting effects
					this.calcArmor += StatusEffects[effect.type].armor * effect.stacks * timeScale;
					break;
				default:
					break;
			}
			effect.time -= dt;
		}
		return awake;
	}

	/**
	 * Troop dies
	 */
	die() {
		let over = false;
		if (this.playerOwned) {
			mode.playerTroops.delete(this);
		}
		else {
			mode.enemyTroops.delete(this);
			if (this.squad && mode instanceof Siege) { // Award currency for winning a siege
				mode.currency += this.squad.base.curPer / 2;
			}
		}

		if (this.squad) {
			// Change squad counts and remove self from roster
			const squad = this.squad;
			squad.allTroops[this.base.id].count--;
			const i = squad.troops.indexOf(this);
			squad.troops.splice(i, 1);
			// If was last troop in squad, squad dies
			if (squad.troops.length == 0) {
				if (squad == mode.selectedSquad) {
					mode.selectedSquad = null;
					mode.hideUI(mode.squadUI);
				}
				squad.dead = true;
				over = mode.checkOver();
				console.log(over);
			}
			// Squad reforms every couple of deaths
			if (this.squad.troops.length <= this.squad.lastChange - this.squad.changeAmt) {
				this.squad.lastChange = this.squad.troops.length;
				this.squad.move(this.squad.pos.x, this.squad.pos.y);
			}
		}
		// Remove any temporary visuals it caused from firing
		for (const wep of this.weapons) {
			if (wep.visual) {
				mode.temporaryVisuals.delete(wep.visual);
			}
		}
		// Remove from spatial grid
		if (this.gridIndex >= 0) {
			const oldCell = mode.grid.cells[this.gridIndex];
			if (oldCell) {
				const i = oldCell.indexOf(this);
				if (i >= 0)
					oldCell.splice(i, 1);
			}
		}
		if (this.base.dieVisual)
			this.base.dieVisual(this.pos.x, this.pos.y, this.pos.angle);
		// End the battle if the mode hit it's checkOver condition
		if (over) return endBattle(mode.playerSquads, mode.enemySquads);
	}
}

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

		this.pros = config.pros ?? [];
		this.cons = config.cons ?? [];
		this.cost = config.cost ?? 1000;
		if ('iconicTroop' in config)
			this.iconicTroop = config.iconicTroop;

		this.static = config.static ?? false; // Can be given move order
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
			this.troops[i].moveLoc = this.getFormationPosition(i);
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

/**
 * Instance of a projectile
 */
class ProjectileInstance {
	/**
	 * Constructor
	 * @param {number} x 			center x
	 * @param {number} y 			center y
	 * @param {number} angle 		initial angle
	 * @param {Projectile} base 	base squad
	 * @param {boolean} team 		true if player owned, false if AI
	 * @param {number} maxRange		max distance it can fly 
	 * @param {Troop} shooter 		unit shooting it for kill counts
	 * @param {Troop} target 		target, used only for missiles
	 * @param {Weapon} baseWeapon	base weapon shooting it
	 */
	constructor(x, y, angle, base, team, maxRange, shooter, target, baseWeapon) {
		this.pos = new Position(x, y, angle);
		this.base = base;
		this.lifetime = (maxRange / base.speed) + 0.05;
		if (base.type == ProjectileType.MISSILE) {
			this.target = target;
			this.lifetime *= 2;
		}
		this.team = team;
		this.shooter = shooter;
		if (base.type === ProjectileType.PIERCE)
			this.hits = []; // Shouldn't hit the same target more than once if piercing
		this.baseWeapon = baseWeapon
		mode.movingProjectiles.add(this);
	}

	/**
	 * Move and check if it hit target
	 * @param {number} dt delta time in seconds
	 */
	tick(dt) {
		// Missile can adjust for moving targets and reacquire new targets if needed
		if (this.base.type == ProjectileType.MISSILE) {
			if (this.target && this.target.health > 0) {
				const targetAngle = this.pos.angleTo(this.target.pos);
				const diff = normalizeAngle(targetAngle - this.pos.angle);

				this.pos.angle = normalizeAngle(this.pos.angle + constrain(
					diff,
					-this.base.turnRate * dt,
					this.base.turnRate * dt
				));
			}
			else {
				const searchArr = mode.grid.query(this.pos.x, this.pos.y, this.lifetime / 2 * this.base.speed);
				let minDistance = Infinity;
				for (const troop of searchArr) {
					if (troop.playerOwned === this.team || troop.health <= 0)
						continue;
					const dst = troop.pos.distanceTo(this.pos);
					if (dst < minDistance) {
						minDistance = dst;
						this.target = troop;
					}
				}
			}
		}

		const oldPos = new Position(this.pos.x, this.pos.y);
		const oldX = this.pos.x;
		const oldY = this.pos.y;

		// Move
		this.pos.x += Math.cos(this.pos.angle) * this.base.speed * dt;
		this.pos.y += Math.sin(this.pos.angle) * this.base.speed * dt;

		// Check if it hit any targets
		const candidates = mode.grid.query(
			(oldX + this.pos.x) / 2,
			(oldY + this.pos.y) / 2,
			this.base.speed * dt / 2 + this.base.r + this.base.areaRange
		);
		for (const troop of candidates) {
			if (troop.playerOwned === this.team || troop.health <= 0)
				continue;
			const coll = segmentEllipseCollision(oldPos, this.pos, troop.pos, troop.base.size, troop.base.sizeY)
			if (coll) {
				this.hit(candidates, troop);
				if (this.base.type !== ProjectileType.PIERCE) {
					this.pos.x = coll.x;
					this.pos.y = coll.y;
					break;
				}
			}
		}
		this.lifetime -= dt;
		// Delete if it moved off the map (unless a missile) or has ended its lifetime
		if (this.lifetime < 0 || (this.base.type !== ProjectileType.MISSILE && (this.pos.x < 0 || this.pos.y < 0 || this.pos.x > MAP_W || this.pos.y > MAP_H))) {
			mode.movingProjectiles.delete(this);
			return;
		}
	}

	/**
	 * Hit target
	 * @param {Troop[]} searchArr	targets in area
	 * @param {Troop} troop 		troop it hit
	 */
	hit(searchArr, troop) {
		// Don't hit same target twice, remove self after hitting if not pierce
		if (this.base.type === ProjectileType.PIERCE) {
			if (this.hits.includes(troop)) return;
		}
		else {
			mode.movingProjectiles.delete(this);
		}

		switch (this.base.type) {
			case ProjectileType.PIERCE:
				damageTroop(this.shooter, troop, this.base.dmg, this.base.ap, this.baseWeapon);
				this.hits.push(troop);
				break;
			case ProjectileType.BULLET:
				damageTroop(this.shooter, troop, this.base.dmg, this.base.ap, this.baseWeapon);
				break;
			case ProjectileType.MISSILE:
			case ProjectileType.AREA:
				switch (this.base.areaType) {
					case AreaType.CIRCLE:
						for (const target of searchArr) {
							if (target.health <= 0 || target.playerOwned === this.team) continue;
							const dst = this.pos.distanceTo(target.pos)
							const maxRange = this.base.areaRange + target.getDirectionalRadius(this.pos);
							if (dst <= maxRange) {
								damageTroop(this.shooter, target, this.base.dmg, this.base.ap, this.baseWeapon);
							}
						}
						TemporaryCircleVisual(this.base.areaRange, this.base.areaRange, this.pos.x, this.pos.y, 0.2, [255, 50, 50, 255]);
						break;
					case AreaType.CONE:
						const direction = this.pos.angle;
						const halfAngle = this.base.areaAngle / 2;
						const cosHalfAngle = Math.cos(halfAngle);
						let hitTg = false;
						for (const target of searchArr) {
							if (target.health <= 0 || target.playerOwned === this.team) continue;

							const difference = target.pos.subtract(this.pos);
							const dst = difference.distance;

							const maxRange = this.base.areaRange + target.getDirectionalRadius(this.pos);

							if (dst > maxRange) continue;

							const dot =
								Math.cos(difference.direction - direction);

							if (dot >= cosHalfAngle) {
								if (target == troop)
									hitTg = true;
								damageTroop(this.shooter, target, this.base.dmg, this.base.ap, this.baseWeapon);
							}
						}
						if (!hitTg)
							damageTroop(this.shooter, troop, this.base.dmg, this.base.ap, this.baseWeapon);
						TemporaryConeVisual(
							this.base.areaRange,
							this.base.areaAngle,
							this.pos.x,
							this.pos.y,
							this.pos.angle,
							0.2,
							[255, 50, 50, 255]
						);
						break;
					case AreaType.LINE:
						const dirX = Math.cos(this.pos.angle);
						const dirY = Math.sin(this.pos.angle);

						const halfWidth = this.base.areaAngle / 2;
						for (const target of searchArr) {
							if (target.health <= 0 || target.playerOwned === this.team) continue;

							// Distance along the projectile's direction
							const difference = target.pos.subtract(this.pos);
							const forward =
								difference.x * dirX +
								difference.y * dirY;

							if (forward < 0 || forward > this.base.areaRange)
								continue;

							// Perpendicular distance from the line
							const perpendicular = Math.abs(
								difference.x * dirY -
								difference.y * dirX
							);

							if (perpendicular <= halfWidth + target.getDirectionalRadius(this.pos.addOffset(target.pos.distanceTo(this.pos), 0))) {
								damageTroop(this.shooter, target, this.base.dmg, this.base.ap, this.baseWeapon);
							}
						}
						const end = this.pos.addOffset(
							this.base.areaRange,
							0
						);
						LaserVisual(
							this.pos.x,
							this.pos.y,
							end.x,
							end.y,
							1,
							0.25
						);
						break;
				}
				break;
		}
	}

	/**
	 * Draw self
	 */
	draw() {
		if (!camera.isInBounds(this.pos.x, this.pos.y, this.base.r))
			return;
		if (Math.min(this.base.size, this.base.sizeY) * camera.scale < 0.25)
			return;
		push();

		translate(this.pos.x, this.pos.y);
		rotate(this.pos.angle);
		for (const visual of this.base.visual[camera.lod]) {
			visual.draw(0, 0, projCols);
		}

		pop();
	}
}

/**
 * Turns the definitions into actual objects, and resolves id links between them into actual points
 * @param {{projectiles: Object[], weapons: Object[], troops: Object[], squads: Object[]}} values	definition dictionary 
 */
function initializeAll(values) {
	// PROJECTILES
	for (const [id, config] of Object.entries(values.projectiles)) {
		new Projectile(
			id,
			config.name,
			config.type,
			config.visual,
			config
		);
	}
	// WEAPONS
	for (const [id, config] of Object.entries(values.weapons)) {
		const weapon = new Weapon(
			id,
			config.name,
			config.type,
			config.visual,
			config
		);
		if (config.projectile !== undefined) {
			weapon.projectile = projectiles[config.projectile];
		}
	}
	// TROOPS
	for (const [id, config] of Object.entries(values.troops)) {
		const troop = new TroopBase(
			id,
			config.name,
			config.visual,
			config
		);
		troop.weapons = config.weapons.map(mountConfig =>
			new WeaponMount(
				weapons[mountConfig.weapon],
				mountConfig
			)
		);
	}
	// SQUADS
	for (const [id, config] of Object.entries(values.squads)) {
		const squad = new SquadBase(
			id,
			config.name,
			config
		);
		squad.startingTroops = config.troops.map(
			troopId => {
				const trp = troopId;
				trp.troop = troops[trp.troop]
				return trp;
			}
		);
		let totalCount = 0;
		let count = -1;
		let highest = null;
		for (const troop of squad.startingTroops) {
			if (troop.count > count) {
				highest = troop;
				count = troop.count;
			}
			totalCount += troop.count;
		}
		squad.curPer = squad.cost / totalCount;
		squad.iconicTroop = squad.iconicTroop ? troops[squad.iconicTroop] : highest.troop;
	}
	// SQUADS
	for (const faction of Object.values(factions)) {
		faction.base = squads[faction.base];
		faction.squads = faction.squads.map(s => squads[s]);
	}
}

/**
 * Damage a troop
 * @param {Troop} dmger 		Troop dealing damage
 * @param {Troop} troop			Troop taking damage
 * @param {number} dmg 			Amount of damage caused
 * @param {number} ap 			Armor piercing of damage
 * @param {Weapon} baseWeapon	Weapon dealing damage
 * @param {boolean} [inflictStatus=true]	Should it inflict new stacks of effects? Default true, false for constant damage
 * @returns 
 */
function damageTroop(dmger, troop, dmg, ap, baseWeapon, inflictStatus=true) {
	if (!troop || troop.health <= 0)
		return;
	if (dmger) dmg *= dmger.calcDMG;
	if (dmg > 0) {
		const shield = troop.shield;
		if (shield > 0) {
			troop.shield -= Math.min(shield, dmg);
			dmg -= Math.min(shield, dmg);
		}
		// Effective Armor = Enemy Armor - AP
		const effectiveArmor = Math.max(troop.calcArmor - ap, 0);
		// Effective Damage = Base Damage * (0.9 ^ Effective Armor).
		const effectiveDMG = dmg * Math.pow(0.9, effectiveArmor);
		if (baseWeapon && baseWeapon.lifeSteal && dmger && dmger.health > 0) {
			dmger.health += effectiveDMG * baseWeapon.lifeSteal;
			if (dmger.health > dmger.base.health)
				dmger.health = dmger.base.health
		}
		troop.health -= effectiveDMG;
		// On kill
		if (troop.health <= 0) {
			if (dmger) dmger.squad.allTroops[dmger.base.id].kills++;
			troop.die();
		}
	}
	else {
		troop.health -= dmg;
	}
	if (troop.health >= 0 && baseWeapon && baseWeapon.statusEffects.length > 0) {
		for (const effect of baseWeapon.statusEffects) {
			troop.inflictStatusEffect(effect, dmger, inflictStatus);
		}
	}
}

/**
 * Normalizes angle to be between -PI and PI
 * 
 * @param {number} angle angle
 * @returns {number}	 same angle but between -PI and PI
 */
function normalizeAngle(angle) {
	if (!Number.isFinite(angle)) {
		throw new Error("NAN");
	}
	return Math.atan2(Math.sin(angle), Math.cos(angle));
}

/**
 * Check if given angle is within a range.
 * Used because the min/max being negative can mess with formulas
 * 
 * @param {number} angle	Given angle 
 * @param {number} min 		Minimum angle
 * @param {number} max 		Maximum angle
 * @returns {boolean}		Angle is within range
 */
function isAngleInRange(angle, min, max) {
	angle = normalizeAngle(angle);
	min = normalizeAngle(min);
	max = normalizeAngle(max);

	if (min <= max) {
		return angle >= min && angle <= max;
	}

	return angle >= min || angle <= max;
}

/**
 * Checks whether a circular target overlaps an angular weapon arc.
 * @param {number} minAngle minimum angle of arc
 * @param {number} maxAngle	maximum angle of arc
 * @param {number} center	angle from origin to target
 * @param {number} radius	radius of target 
 * @returns {boolean}		if in range
 */
function angleRangeIntersectsTarget(
	minAngle,
	maxAngle,
	center,
	radius
) {
	// Target center is inside weapon arc
	if (isAngleInRange(center, minAngle, maxAngle))
		return true;

	// Target's left edge is inside weapon arc
	if (
		isAngleInRange(
			normalizeAngle(center - radius),
			minAngle,
			maxAngle
		)
	) {
		return true;
	}

	// Target's right edge is inside weapon arc
	if (
		isAngleInRange(
			normalizeAngle(center + radius),
			minAngle,
			maxAngle
		)
	) {
		return true;
	}

	// The weapon arc may be completely inside the target's
	// angular width, so also check the weapon arc's midpoint.
	const arcSize = normalizeAngle(maxAngle - minAngle);

	const arcCenter = normalizeAngle(
		minAngle + arcSize / 2
	);

	if (
		Math.abs(normalizeAngle(arcCenter - center)) <= radius
	) {
		return true;
	}

	return false;
}

/**
 * Find the points where two circles overlap, used mainly for move overlaps. Solves the system of equations:
 * 
 * (x - pos0.x)^2 + (y - pos0.y)^2 = r0^2
 * 
 * (x - pos1.x)^2 + (y - pos1.y)^2 = r1^2
 * 
 * @param {Position} pos0	position of circle 0
 * @param {number} r0 		radius of circle 0
 * @param {Position} pos1 	center of circle 1
 * @param {number} r1 		radius of circle 1
 * @returns {Position[]}	array of overlap points. Will have 0, 1, or 2 points				
 */
function findCircleIntersections(pos0, r0, pos1, r1) {
	const dx = pos1.x - pos0.x;
	const dy = pos1.y - pos0.y;
	const d = Math.hypot(dx, dy);

	// No intersection: too far apart or one inside the other
	if (d > r0 + r1 || d < Math.abs(r0 - r1) || d === 0) {
		return [];
	}

	// Distance from circle 0 to the chord line point
	const a = (r0 * r0 - r1 * r1 + d * d) / (2 * d);

	// Half the height of the intersection chord
	const h = Math.sqrt(Math.max(0, r0 * r0 - a * a));

	// Center point of the chord (P2)
	const x2 = pos0.x + (dx * a) / d;
	const y2 = pos0.y + (dy * a) / d;

	// Offset offsets to the two intersection points
	const rx = (-dy * h) / d;
	const ry = (dx * h) / d;

	const p1 = new Position(x2 + rx, y2 + ry);
	const p2 = new Position(x2 - rx, y2 - ry);

	// If h is 0, circles touch at a single point
	if (h === 0) return [p1];

	return [p1, p2];
}

/**
 * Check if a line segment overlaps with a troop circle. Used for projectile collisions
 * @param {number} x1 		Line segment start x
 * @param {number} y1 		Line segment start y
 * @param {number} x2 		Line segment end x
 * @param {number} y2 		Line segment end y
 * @param {number} cx 		Circle center x
 * @param {number} cy 		Circle center y
 * @param {number} radius	Circle radius
 * @returns {boolean}		If they overlap
 */
function segmentCircleCollision(x1, y1, x2, y2, cx, cy, radius) {
	const dx = x2 - x1;
	const dy = y2 - y1;

	const lengthSq = dx * dx + dy * dy;

	let t;

	if (lengthSq === 0) {
		t = 0;
	} else {
		t = ((cx - x1) * dx + (cy - y1) * dy) / lengthSq;
		t = Math.max(0, Math.min(1, t));
	}

	const closestX = x1 + dx * t;
	const closestY = y1 + dy * t;

	const distX = cx - closestX;
	const distY = cy - closestY;

	return distX * distX + distY * distY <= radius * radius;
}

/**
 * Check if a line segment overlaps with a troop ellipse. Used for projectile collisions
 * @param {Position} p0 		Line segment start
 * @param {Position} p1 		Line segment end
 * @param {Position} ellipse 	Ellipse center
 * @param {number} radiusX		Ellipse horizontal radius
 * @param {number} radiusY		Ellipse vertical radius
 * @param {number} [angle=0]	Angle between them
 * @returns {boolean}			If they overlap
 */
function segmentEllipseCollision(p0, p1, ellipse, radiusX, radiusY, angle = 0) {
	const cos = Math.cos(angle);
	const sin = Math.sin(angle);

	// Transform segment into ellipse-local coordinates.
	const dx0 = p0.x - ellipse.x;
	const dy0 = p0.y - ellipse.y;

	const dx1 = p1.x - ellipse.x;
	const dy1 = p1.y - ellipse.y;

	const x0 = dx0 * cos + dy0 * sin;
	const y0 = -dx0 * sin + dy0 * cos;

	const x1 = dx1 * cos + dy1 * sin;
	const y1 = -dx1 * sin + dy1 * cos;

	const dx = x1 - x0;
	const dy = y1 - y0;

	const rx2 = radiusX * radiusX;
	const ry2 = radiusY * radiusY;

	const a =
		dx * dx / rx2 +
		dy * dy / ry2;

	const b =
		2 * (x0 * dx / rx2 +
			y0 * dy / ry2);

	const c =
		x0 * x0 / rx2 +
		y0 * y0 / ry2 - 1;

	// Already inside the ellipse.
	if (c <= 0) {
		return {
			x: p0.x,
			y: p0.y
		};
	}

	if (a === 0)
		return null;

	const discriminant = b * b - 4 * a * c;

	if (discriminant < 0)
		return null;

	const sqrtD = Math.sqrt(discriminant);

	const t1 = (-b - sqrtD) / (2 * a);
	const t2 = (-b + sqrtD) / (2 * a);

	// Find the earliest intersection along the segment.
	let t = Infinity;

	if (t1 >= 0 && t1 <= 1)
		t = t1;

	if (t2 >= 0 && t2 <= 1 && t2 < t)
		t = t2;

	if (t === Infinity)
		return null;

	return {
		x: p0.x + (p1.x - p0.x) * t,
		y: p0.y + (p1.y - p0.y) * t
	};
}

/**
 * Given direction of laser, find the first target it collides with
 * @param {Position} origin	origin of laser
 * @param {number} angle 	direction of laser
 * @param {Troop[]} targets possible targets
 * @param {number} range 	maximum range
 * @param {boolean} team 	true for player, false for AI
 * @returns {Troop}			target
 */
function getLaserTarget(origin, angle, targets, range, team) {
	const dx = Math.cos(angle);
	const dy = Math.sin(angle);

	let closest = null;
	let closestDistance = range;

	for (const target of targets) {
		if (target.health <= 0 || target.playerOwned == team)
			continue;

		const tx = target.pos.x - origin.x;
		const ty = target.pos.y - origin.y;

		// Distance along the laser
		const along = tx * dx + ty * dy;

		if (along < 0 || along > range)
			continue;

		// Perpendicular distance from target center to laser
		const perpendicular = Math.abs(tx * dy - ty * dx);
		if (perpendicular > target.getDirectionalRadius(origin.addOffset(target.pos.distanceTo(origin), 0, 0)))
			continue;

		// Laser intersects the target's circle.
		// Find the distance to the first point of intersection.
		const offset = Math.sqrt(
			target.base.size * target.base.size -
			perpendicular * perpendicular
		);

		const hitDistance = along - offset;

		if (hitDistance < closestDistance) {
			closest = target;
			closestDistance = hitDistance;
		}
	}

	return closest;
}

/**
 * Get the squad at given map coordinates (not screen coordinates),
 * based on the troop being clicked. If no troop in that spot, does not select any squad
 * 
 * @param {number} x 				Map x coordinate
 * @param {number} y				Map y coordinate 
 * @param {boolean} [player=true]	Are we getting a player or enemy squad
 * @returns {Squad}					Squad at position
 */
function getSquadAt(x, y, player = true) {
	const mousePos = new Position(x, y);
	const searchArr = mode.grid.query(x, y, clickRange);
	if (searchArr.length === 0)
		return null;
	let minTroop = null;
	let minDistance = Infinity;
	for (const troop of searchArr) {
		if (!player && troop.playerOwned !== player)
			continue;
		const dst = Math.max(troop.pos.distanceTo(mousePos) - troop.getDirectionalRadius(mousePos), 0);
		if (!minTroop || dst < minDistance || (dst === minDistance && minTroop.base.static)) {
			minTroop = troop;
			minDistance = dst;
		}
	}
	if (!minTroop)
		return null;
	const radius = minTroop.getDirectionalRadius(mousePos);
	const multiplier = 1 + 0.5 * (20 / radius);
	if (minDistance <= radius * multiplier) {
		return minTroop.squad;
	}

	return null;
}

/**
 * Convert radians to degrees
 * @param {number} radians 	radians
 * @returns {number}		degrees
 */
function radsToDegrees(radians) {
	return Math.round(radians * 180 / Math.PI)
}