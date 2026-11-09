/**
 * Represents a position.
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