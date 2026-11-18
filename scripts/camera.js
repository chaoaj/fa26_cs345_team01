// Camera speed
const CAMERA_SPEED = 500;
let RES_X = 1280;
let RES_Y = 720;
let MAP_W = RES_X;
let MAP_H = RES_Y;

// Can't zoom out beyond bounds of map
let minZoom = Math.max(
    RES_X / MAP_W,
    RES_Y / MAP_H
);
const maxZoom = 5;

// Camera in use
let camera;

/**
 * Camera class.
 * Handles what portion of the map the canvas is showing
 */
class Camera {
    constructor(x = MAP_W / 2, y = MAP_H / 2, zoom = 1) {
        this.x = x;
        this.y = y;
        this.zoom = zoom;
    }

    /**
     * Zooms in to draw specific areas of the map.
     * Allows us to draw using map coordinates and they automatically correspond to the screen coordinates
     */
    begin() {
        push();

        translate(RES_X / 2, RES_Y / 2);
        scale(this.zoom);
        translate(-this.x, -this.y);
    }

    /**
     * End camera drawing, so coordinates once again represent screen coordinates instead of map ones
     */
    end() {
        pop();
    }

    /**
     * Used to convert screen coordinates to map ones, like for mPos
     * @param {number} x    screen X
     * @param {number} y    screen Y
     * @returns {Position}  map position
     */
    screenToWorld(x, y) {
        return new Position(
            (x - RES_X / 2) / this.zoom + this.x,
            (y - RES_Y / 2) / this.zoom + this.y
        );
    }

    /**
     * Used to convert map coordinates to screen ones
     * @param {number} x    map X
     * @param {number} y    map Y
     * @returns {Position}  screen position
     */
    worldToScreen(x, y) {
        return new Position(
            (x - this.x) * this.zoom + RES_X / 2,
            (y - this.y) * this.zoom + RES_Y / 2
        );
    }

    /**
     * Check if object at (x, y) with radius r is on screen and should be drawn
     * @param {number} x    center x
     * @param {number} y    center y
     * @param {number} r    radius
     * @returns {boolean}   if onscreen
     */
    isInBounds(x, y, r) {
        const halfWidth = RES_X / (2 * this.zoom);
        const halfHeight = RES_Y / (2 * this.zoom);

        return (
            x >= this.x - halfWidth - r &&
            x <= this.x + halfWidth + r &&
            y >= this.y - halfHeight - r &&
            y <= this.y + halfHeight + r
        );
    }

    /**
     * Move camera by amount and then make sure not going out of bounds
     * @param {number} dx horizontal change
     * @param {number} dy vertical change
     */
    move(dx, dy) {
        this.x += dx;
        this.y += dy;
        this.clamp();
    }

    /**
     * Ensure x and y are within the bounds of the map based on zoom
     */
    clamp() {
        const halfWidth = RES_X / (2 * this.zoom);
        const halfHeight = RES_Y / (2 * this.zoom);

        this.x = constrain(
            this.x,
            halfWidth,
            MAP_W - halfWidth
        );

        this.y = constrain(
            this.y,
            halfHeight,
            MAP_H - halfHeight
        );
    }

    /**
     * Set zoom and change map alpha for foreground options
     * @param {number} zoom new zoom 
     */
    setZoom(zoom) {
        this.zoom = constrain(zoom, minZoom, maxZoom);
        this.clamp();
        if (mode.map) {
            mode.map.alpha = 255 * (1 - constrain(
                (this.zoom - minZoom) / (maxZoom - minZoom),
                0.1,
                0.95
            ));
        }
    }

    /**
     * Update based on keys pressed so WASD can move camera. Doesn't seem to register key down, unsure why
     * @param {number} dt delta time
     */
    update(dt) {
        let dx = 0;
        let dy = 0;

        if (keyIsDown(87)) dy -= 1; // W
        if (keyIsDown(65)) dx -= 1; // A
        if (keyIsDown(83)) dy += 1; // S
        if (keyIsDown(68)) dx += 1; // D

        if (dx === 0 && dy === 0) {
            return;
        }

        const length = Math.hypot(dx, dy);
        dx /= length;
        dy /= length;

        const speed = CAMERA_SPEED / this.zoom;

        this.move(
            dx * speed * dt,
            dy * speed * dt
        );
    }
}

/**
 * When scrolling, zoom in/out
 * @param {*} event     mouse wheel event
 * @returns {boolean}   always false 
 */
function mouseWheel(event) {
    if (mode.finished) return;
    // World position underneath the mouse before zooming
    const before = camera.screenToWorld(mouseX, mouseY);

    // Positive delta = scroll down, negative = scroll up
    const zoomFactor = Math.pow(1.1, -event.delta / 100);

    camera.zoom = constrain(
        camera.zoom * zoomFactor,
        minZoom,
        maxZoom
    );

    // World position underneath the mouse after zooming
    const after = camera.screenToWorld(mouseX, mouseY);

    // Move camera so the point under the mouse stays there
    camera.x += before.x - after.x;
    camera.y += before.y - after.y;

    camera.clamp();
    return false;
}