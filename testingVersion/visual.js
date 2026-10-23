/*
const EXAMPLE_VISUAL = {
    LOD0: [put visual objects here], // The most detailed version of a visual, shown when zoomed in
    LOD1: [put visual objects here], // Middle level detailed, leave out small details, simplify complicated shapes
    LOD2: [put visual objects here], // Lowest level of detail, shown when zoomed out far, simplify to 
                                     // the handful of shapes needed to maintain distinctiveness
};
*/

// List of stock colors that we can use in visuals
const STOCK_COLORS = Object.freeze({
    WOOD: [142, 85, 0, 255],
    WHITE: [255, 255, 255, 255],
    BONE: [227, 218, 201, 255],
    CRIMSON: [200, 0, 0, 255],
    GOLD: [255, 215, 0, 255],
    LIGHTNING1: [162, 191, 255, 200],
    LIGHTNING2: [222, 255, 254, 200],
    LIGHTNING3: [250, 251, 165, 200],
    FLAME1: [255, 90, 0, 255],
    FLAME2: [255, 154, 0, 255],
    FLAME3: [255, 206, 0, 255],
    ENERGY: [141, 243, 255, 50],
    PROS: [180, 255, 180, 255],
    CONS: [255, 180, 180, 255],
    SCARLET: [255, 36, 0, 255],
    ROYALBLUE: [45, 80, 220, 255],
    EMERALD: [0, 160, 70, 255],
    PURPLE: [128, 0, 180, 255],
    MAGENTA: [220, 0, 130, 255],
    TEAL: [0, 130, 125, 255],
    HALO: [255, 232, 143, 200],
    LEATHER: [83, 46, 33, 255]
});
const NO_VISUAL = { LOD0: [], LOD1: [], LOD2: [] };

// Camera speed
const CAMERA_SPEED = 500;

// Can't zoom out beyond bounds of map
const minZoom = Math.max(
    RES_X / MAP_W,
    RES_Y / MAP_H
);
const maxZoom = 5;

// Levels of detail and their keys.
const LOD = Object.freeze({
    LOD0: 'LOD0',
    LOD1: 'LOD1',
    LOD2: 'LOD2',
});

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
        this.lod = this.getLod;
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
        this.lod = this.getLod;
    }

    /**
     * Get the level of detail to draw
     */
    get getLod() {
        if (this.zoom >= maxZoom / 3)
            return LOD.LOD0;
        else if (this.zoom >= maxZoom / 6)
            return LOD.LOD1;
        return LOD.LOD2;
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

    if (mode.map) {
        mode.map.alpha = 255 * (1 - constrain(
            (camera.zoom - minZoom) / (maxZoom - minZoom),
            0.15,
            0.9
        ));
    }
    camera.lod = camera.getLod;
    return false;
}

/**
 * The draw function used by Visual
 *
 * @callback drawFn
 * @param {number} x        center x
 * @param {number} y        center y
 * @param {number[]} cols   team colors
 * @param {number} timeElapsed  time elapsed since start, used for animations
 */

/**
 * The draw function used by TemporaryVisual. These don't use team colors and have a fixed x/y, so no params
 *
 * @callback temporaryDrawFn
 */

/**
 * Visual class. Stores a draw function and a shade value.
 * These objects allow us to keep track of what should be drawn for each object, and draw them
 * without needed to define a specific draw function for everything on the map. Draw functions
 * usually should accept the variables (x, y, cols) where x and y are center position and cols
 * are team colors. Team colors should be affected by the shade variable in the draw fn
 */
class Visual {
    /**
     * 
     * @param {drawFn} draw function to draw visual
     * @param {number} grey number between 0 and 255, affects team colors brightness
     */
    constructor(draw, grey) {
        this.draw = draw;
        this.shade = grey / 255;
    }
}

/**
 * The same as a Visual, but this one only lasts a bit of time and fades out. Rather than being
 * stored on an object, these are kept in a set in mode and drawn/removed from there
 */
class TemporaryVisual extends Visual {
    /**
     * 
     * @param {temporaryDrawFn} draw    drawn function
     * @param {number} grey             number between 0 and 255, affects team colors brightness
     * @param {number} time             time it lasts on screen in seconds
     */
    constructor(draw, grey, time = 1) {
        super(draw, grey);
        this.time = time;
        this.maxTime = time;
        this.transparency = 1; // Fades over time
        if ('temporaryVisuals' in mode) // Just in case we swap back to a menu and accidentally try to create one here
            mode.temporaryVisuals.add(this);
    }

    /**
     * Decrease own time remaining, and fade out
     * @param {number} dt   delta time in seconds
     */
    tick(dt) {
        this.time -= dt;
        if (this.time <= 0)
            mode.temporaryVisuals.delete(this);
        this.transparency = Math.min(this.time / this.maxTime, 1);
    }
}

/* Below are simplified functions that can build a simple Visual without
 * needing to build the draw function by hand. Note that positive X is forward
 */

/**
 * Builds a Rectangle Visual, centered on (0, 0)
 * @param {number} w                width
 * @param {number} h                height
 * @param {number} [xo=0]           x offset from center
 * @param {number} [yo=0]           y offset from center
 * @param {number} [ao=0]           angle in radians. 0 is forward (positive X), Math.PI / 2 is facing down, -Math.PI / 2 is facing up, +-Math.PI is backwards
 * @param {number} [grey=255]       grey
 * @param {number} [sw=1]           stroke width
 * @param {number[]} [altColors=[]] if using colors other than team colors in format [r, g, b, a]
 * @returns {Visual}
 */
const RectVisual = (w, h, xo = 0, yo = 0, ao = 0, grey = 255, sw = 1, altColors = []) => new Visual(function (x, y, colors = [255, 255, 255], t) {
    push();
    translate(x + xo, y + yo);
    rotate(ao);
    strokeWeight(sw);
    const baseArray = altColors.length >= 3 ? altColors : colors;
    const shaded = baseArray.map(c => c * this.shade);
    const alpha = shaded.length < 4 ? 255 : baseArray[3];
    fill(shaded[0], shaded[1], shaded[2], alpha);
    stroke(shaded[0], shaded[1], shaded[2], alpha);
    rectMode(CENTER);
    rect(0, 0, w, h);
    pop();
}, grey);

/**
 * Builds a Triangle Visual, centered on (0, 0)
 * @param {number} x0               point 1 X
 * @param {number} y0               point 1 Y
 * @param {number} x1               point 2 X
 * @param {number} y1               point 2 Y
 * @param {number} x2               point 3 X
 * @param {number} y2               point 3 Y
 * @param {number} [grey=255]       grey
 * @param {number} [sw=1]           stroke width
 * @param {number[]} [altColors=[]] if using colors other than team colors in format [r, g, b, a]
 * @returns {Visual}
 */
const TriangleVisual = (
    x0, y0,
    x1, y1,
    x2, y2,
    grey = 255,
    sw = 1,
    altColors = []
) => new Visual(function (x, y, colors = [255, 255, 255], t) {
    push();
    translate(x, y);
    if (sw > 0) {
        strokeJoin(ROUND);
    }
    strokeWeight(sw);
    const baseArray = altColors.length >= 3 ? altColors : colors;
    const shaded = baseArray.map(c => c * this.shade);
    const alpha = shaded.length < 4 ? 255 : baseArray[3];
    fill(shaded[0], shaded[1], shaded[2], alpha);
    stroke(shaded[0], shaded[1], shaded[2], alpha);
    triangle(
        x0, y0,
        x1, y1,
        x2, y2
    );
    pop();
}, grey);

/**
 * Builds a Circle/Ellipse Visual, centered on (0, 0)
 * @param {number} w                width
 * @param {number} h                height
 * @param {number} [xo=0]           x offset from center
 * @param {number} [yo=0]           y offset from center
 * @param {number} [grey=255]       grey
 * @param {number} [sw=1]           stroke width
 * @param {number[]} [altColors=[]] if using colors other than team colors in format [r, g, b, a]
 * @returns {Visual}
 */
const CircleVisual = (w, h, xo = 0, yo = 0, grey = 255, sw = 1, altColors = []) => new Visual(function (x, y, colors = [255, 255, 255], t) {
    push();

    translate(x + xo, y + yo);
    strokeWeight(sw);
    const baseArray = altColors.length >= 3 ? altColors : colors;
    const shaded = baseArray.map(c => c * this.shade);
    const alpha = shaded.length < 4 ? 255 : baseArray[3];
    fill(shaded[0], shaded[1], shaded[2], alpha);
    stroke(shaded[0], shaded[1], shaded[2], alpha);
    ellipse(0, 0, w, h);

    pop();
}, grey);

/**
 * Builds a Circle/Ellipse Visual, centered on (0, 0) with no fill
 * @param {number} w                width
 * @param {number} h                height
 * @param {number} [sw=1]           stroke width
 * @param {number} [xo=0]           x offset from center
 * @param {number} [yo=0]           y offset from center
 * @param {number} [grey=255]       grey
 * @param {number[]} [altColors=[]] if using colors other than team colors in format [r, g, b, a]
 * @returns {Visual}
 */
const CircleOutlineVisual = (w, h, sw = 1, xo = 0, yo = 0, grey = 255, altColors = []) => new Visual(function (x, y, colors = [255, 255, 255], t) {
    push();
    translate(x + xo, y + yo);
    noFill();
    strokeWeight(sw);
    const baseArray = altColors.length >= 3 ? altColors : colors;
    const shaded = baseArray.map(c => c * this.shade);
    const alpha = shaded.length < 4 ? 255 : baseArray[3];
    stroke(shaded[0], shaded[1], shaded[2], alpha);
    ellipse(0, 0, w - sw, h - sw);
    pop();
}, grey);

/**
 * Builds a Shape visual, centered on (0, 0). This is filled
 * @param {{x: number, y: number, curve: boolean}[]} pts    List of points. If curve=false, straight line between points.
 *                                                          Otherwise curved line between them
 * @param {number} [grey=255]                               Grey
 * @param {number} [sw=1]                                   Stroke width
 * @param {number[]} [altColors=[]]                         If using colors other than team colors in format [r, g, b, a]
 * @returns {Visual}
 */
const ShapeVisual = (
    pts = [],
    grey = 255,
    sw = 1,
    altColors = []
) => new Visual(function (x, y, colors = [255, 255, 255], t) {
    push();
    translate(x, y);
    if (sw > 0) {
        strokeJoin(ROUND);
    }
    strokeWeight(sw);

    const baseArray = altColors.length >= 3 ? altColors : colors;
    const shaded = baseArray.map(c => c * this.shade);
    const alpha = shaded.length < 4 ? 255 : baseArray[3];
    fill(shaded[0], shaded[1], shaded[2], alpha);
    stroke(shaded[0], shaded[1], shaded[2], alpha);

    beginShape();
    for (const pt of pts) {
        if (pt.curve) {
            splineVertex(pt.x, pt.y);
        } else {
            vertex(pt.x, pt.y);
        }
    }
    endShape(CLOSE);

    pop();
}, grey);

/**
 * Builds a Line visual, centered on (0, 0). This is not filled, nor closed
 * @param {{x: number, y: number, curve: boolean}[]} pts    List of points. If curve=false, straight line between points.
 *                                                          Otherwise curved line between them
 * @param {number} [grey=255]                               Grey
 * @param {number} [sw=1]                                   Stroke width
 * @param {number[]} [altColors=[]]                         If using colors other than team colors in format [r, g, b, a]
 * @returns {Visual}
 */
const LineVisual = (
    pts = [],
    grey = 255,
    sw = 1,
    altColors = []
) => new Visual(function (x, y, colors = [255, 255, 255], t) {
    push();
    translate(x, y);
    if (sw > 0) {
        strokeJoin(ROUND);
    }
    strokeWeight(sw);
    const baseArray = altColors.length >= 3 ? altColors : colors;
    const shaded = baseArray.map(c => c * this.shade);
    const alpha = shaded.length < 4 ? 255 : baseArray[3];
    noFill();
    stroke(shaded[0], shaded[1], shaded[2], alpha);

    beginShape();
    for (const pt of pts) {
        if (pt.curve) {
            splineVertex(pt.x, pt.y);
        } else {
            vertex(pt.x, pt.y);
        }
    }
    endShape();

    pop();
}, grey);

/**
 * Returns a TemporaryVisual line between two points
 * @param {number} x                            start x
 * @param {number} y                            start y
 * @param {number} tx                           target x
 * @param {number} ty                           target y
 * @param {number} [w=1]                        width of line
 * @param {number} [length=1]                   duration it lasts in seconds
 * @param {number[]} [colors=[255, 0, 0, 255]]  color in format [r, g, b, a]
 * @returns {TemporaryVisual}
 */
const LaserVisual = (x, y, tx, ty, w = 1, length = 1, colors = [255, 0, 0, 255]) => new TemporaryVisual(function () {
    push();
    stroke(colors[0], colors[1], colors[2], colors[3] * this.transparency);
    strokeWeight(w);
    line(x, y, tx, ty);
    pop();
}, colors[0], length);

/**
 * Returns a TemporaryVisual line between two points. Unlike LaserVisual, this one stores the positions
 * and can change the points as needed in troop tick
 * @param {number} x                            start x
 * @param {number} y                            start y
 * @param {number} tx                           target x
 * @param {number} ty                           target y
 * @param {number} [w=1]                        width of line
 * @param {number} [length=1]                   duration it lasts in seconds
 * @param {number[]} [colors=[255, 0, 0, 255]]  color in format [r, g, b, a]
 * @returns {TemporaryVisual}
 */
const ConstantLaserVisual = (x, y, tx, ty, w = 1, length = 1, colors = [255, 0, 0, 255]) => {
    const visual = new TemporaryVisual(function () {
        const shaded = colors.map(c => c * this.shade);
        push();
        stroke(colors[0], colors[1], colors[2], colors[3] * this.transparency);
        strokeWeight(w);
        line(this.x, this.y, this.tx, this.ty);
        pop();
    }, 255, length);

    visual.x = x;
    visual.y = y;
    visual.tx = tx;
    visual.ty = ty;

    return visual;
};

/**
 * Builds a Circle/Ellipse TemporaryVisual
 * @param {number} w                            width
 * @param {number} h                            height
 * @param {number} x                            center x 
 * @param {number} y                            center y
 * @param {number} [length=1]                   duration it lasts in seconds
 * @param {number[]} [colors=[255, 0, 0, 255]]  color in format [r, g, b, a]
 * @returns {TemporaryVisual}
 */
const TemporaryCircleVisual = (w, h, x, y, length = 1, colors = STOCK_COLORS.WHITE) => {
    const visual = new TemporaryVisual(function () {
        const shaded = colors.map(c => c * this.shade);
        push();
        translate(this.x, this.y);
        fill(shaded[0], shaded[1], shaded[2], colors[3] * this.transparency);
        strokeWeight(0);
        ellipse(0, 0, this.range, this.angle);
        pop();
    }, 255, length);
    visual.x = x;
    visual.y = y;
    visual.range = w;
    visual.angle = h;
    return visual;
}

/**
 * Builds a Circle/Ellipse outline TemporaryVisual
 * @param {number} w                            width
 * @param {number} h                            height
 * @param {number} x                            center x 
 * @param {number} y                            center y
 * @param {number} [sw=1]                       stroke weight 
 * @param {number} [length=1]                   duration it lasts in seconds
 * @param {number[]} [colors=[255, 0, 0, 255]]  color in format [r, g, b, a]
 * @returns {TemporaryVisual}
 */
const TemporaryCircleOutlineVisual = (w, h, x, y, sw = 1, length = 1, colors = STOCK_COLORS.WHITE) => {
    const visual = new TemporaryVisual(function () {
        const shaded = colors.map(c => c * this.shade);
        push();
        translate(this.x, this.y);
        noFill()
        strokeWeight(sw);
        stroke(shaded[0], shaded[1], shaded[2], colors[3] * this.transparency);
        ellipse(0, 0, this.range - sw, this.angle - sw);
        pop();
    }, 255, length);
    visual.x = x;
    visual.y = y;
    visual.range = w;
    visual.angle = h;
    return visual;
}

/**
 * Builds a Cone temporary visual
 * @param {number} range                            length of cone
 * @param {number} angle                            total width of cone (so Math.PI / 2 would be a 90 degree cone)
 * @param {number} x                                origin x
 * @param {number} y                                origin y
 * @param {number} direction                        direction pointed in
 * @param {number} [length=1]                       duration it lasts in seconds
 * @param {number[]} [colors=[255, 255, 255, 255]]  color in format [r, g, b, a]
 * @returns {TemporaryVisual}
 */
const TemporaryConeVisual = (
    range,
    angle,
    x,
    y,
    direction,
    length = 1,
    colors = STOCK_COLORS.WHITE
) => {
    const visual = new TemporaryVisual(function () {
        const shaded = colors.map(c => c * this.shade);

        push();
        translate(this.x, this.y);

        const halfAngle = this.angle / 2;

        fill(shaded[0], shaded[1], shaded[2], colors[3] * this.transparency);
        if (colors[3] < 255) {
            strokeWeight(0);
        }
        else {
            stroke(shaded[0], shaded[1], shaded[2], colors[3] * this.transparency);
        }

        arc(
            0,
            0,
            this.range * 2,
            this.range * 2,
            this.direction - halfAngle,
            this.direction + halfAngle,
            PIE
        );

        pop();
    }, 255, length);

    visual.x = x;
    visual.y = y;
    visual.range = range;
    visual.angle = angle;
    visual.direction = direction;

    return visual;
};

// DEFINED PARTS FOR UNITS
function morionVisual(grey = 170) {
    return new Visual(function (x, y, cols, timeElapsed = 0) {
        push();
        translate(x, y);
        strokeWeight(1.25);
        strokeJoin(MITER);
        stroke(grey - 20);
        fill(grey);

        beginShape();
        vertex(6, 0);
        splineVertex(5.75, 0.5);
        splineVertex(2, 3.5);
        splineVertex(-2, 3.5);
        splineVertex(-5.75, 0.5);
        vertex(-6, 0);
        splineVertex(-5.75, -0.5);
        splineVertex(-2, -3.5);
        splineVertex(2, -3.5);
        splineVertex(5.75, -0.5);
        endShape(CLOSE);

        strokeWeight(0);
        fill(grey - 20);
        beginShape();
        vertex(6, 0);
        vertex(0, .5);
        vertex(-6, 0);
        vertex(0, -.5);
        endShape(CLOSE);
        triangle(8, 0, 5.75, -1, 5.75, 1);
        triangle(-8, 0, -5.75, -1, -5.75, 1);

        pop();
    }, 255)
};

function armoredBody(grey = 255, capeGrey = 255, colors = undefined, capeColors = undefined, capePts = [], xOffset = 0, trimColors = undefined) {
    return new Visual(function (x, y, cols, timeElapsed = 0) {
        // Body colors
        const shaded = (colors ? colors : cols).map(c => c * this.shade);
        const alpha = shaded.length > 3 ? (colors ? colors : cols)[3] : 255;
        if (shaded.length > 3) shaded[3] = alpha;
        else shaded.push(alpha);
        const vals = shaded.map(val => Math.min(255, val + 20));
        // Cape colors
        const shadedCape = (capeColors ? capeColors : cols).map(c => c * capeGrey / 255);
        const capeAlpha = shadedCape.length > 3 ? (capeColors ? capeColors : cols)[3] : 255;
        if (shadedCape.length > 3) shadedCape[3] = capeAlpha;
        else shadedCape.push(capeAlpha);

        push();
        translate(x + xOffset, y);

        fill(...shaded); 
        let bw = 4.5;
        if (trimColors) {
            strokeWeight(0.5);
            stroke(...trimColors);
            bw = 3.5;
        } else {
            strokeWeight(0);
        }
        rectMode(CENTER);
        rect(0, 0, bw, 12);
        strokeWeight(0.25);
        ellipse(0, 0, 5);

        if (capePts.length > 0) {
            strokeWeight(1);
            fill(...shadedCape);
            stroke(...shadedCape);
            strokeJoin(ROUND);
            beginShape();
            for (const pt of capePts) {
                if (pt.curve) {
                    splineVertex(pt.x, pt.y);
                } else {
                    vertex(pt.x, pt.y);
                }
            }
            endShape(CLOSE);
            strokeJoin(MITER);
        }
        strokeWeight(0.5);
        const strokeCols = trimColors ? trimColors : shaded;
        stroke(...strokeCols);
        fill(...vals);
        arc(0, -5, 5, 7, PI, 0);
        arc(0, -5, 5, .5, 0, PI);
        arc(0, 5, 5, 7, 0, PI);
        arc(0, 5, 5, .5, PI, 0);
        pop();
    }, grey);
}

const PLUME_ARR = {
    LOD0: [
        { x: 0, y: 0, curve: false },
        { x: -3, y: -1, curve: true },
        { x: -7, y: -3, curve: true },
        { x: -12, y: -2, curve: true },
        { x: -16, y: 0, curve: false },
        { x: -12, y: 2, curve: true },
        { x: -7, y: 3, curve: true },
        { x: -3, y: 1, curve: true },
        { x: 0, y: 0, curve: false }
    ],
    LOD1: [
        { x: 0, y: 0, curve: false },
        { x: -5, y: -2, curve: true },
        { x: -12, y: -2, curve: true },
        { x: -16, y: 0, curve: false },
        { x: -12, y: 2, curve: true },
        { x: -5, y: 2, curve: true },
        { x: 0, y: 0, curve: false }
    ],
    LOD2: (grey = 255, colors = undefined) => {
        if (colors)
            return RectVisual(15, 1, -7.5, 0, 0, grey, 0, colors);
        return RectVisual(15, 1, -7.5, 0, 0, grey, 0);
    }
};
const PLUME_1_ARR = {
    LOD0: [
        { x: 0, y: 0, curve: false },
        { x: -2, y: -1.5, curve: true },
        { x: -5, y: -3, curve: true },
        { x: -8, y: -3.5, curve: true },
        { x: -11, y: -2.5, curve: true },
        { x: -14, y: -1, curve: true },
        { x: -12, y: 0, curve: false },
        { x: -15, y: 1, curve: true },
        { x: -11, y: 1.5, curve: true },
        { x: -8, y: 2, curve: true },
        { x: -5, y: 1.5, curve: true },
        { x: -2, y: 0.5, curve: true },
        { x: 0, y: 0, curve: false }
    ],
    LOD1: [
        { x: 0, y: 0, curve: false },
        { x: -5, y: -3, curve: true },
        { x: -11, y: -2.5, curve: true },
        { x: -14, y: -1, curve: true },
        { x: -15, y: 1, curve: true },
        { x: -8, y: 2, curve: true },
        { x: -5, y: 1, curve: true },
        { x: 0, y: 0, curve: false }
    ],
    LOD2: (grey = 255, colors = undefined) => {
        if (colors)
            return RectVisual(12, 2, -6, 0, 0, grey, 0, colors);
        return RectVisual(12, 2, -6, 0, 0, grey, 0);
    }
};
const PLUME_2_ARR = {
    LOD0: [
        { x: 0, y: 0, curve: false },
        { x: -2, y: -2, curve: true },
        { x: -5, y: -3, curve: true },
        { x: -8, y: -4, curve: true },
        { x: -11, y: -3, curve: true },
        { x: -14, y: -1, curve: true },
        { x: -16, y: -2, curve: false },
        { x: -14, y: 0, curve: false },
        { x: -17, y: 2, curve: false },
        { x: -13, y: 2, curve: true },
        { x: -10, y: 3, curve: true },
        { x: -7, y: 2, curve: true },
        { x: -4, y: 1.5, curve: true },
        { x: -2, y: 0.5, curve: true },
        { x: 0, y: 0, curve: false }
    ],
    LOD1: [
        { x: 0, y: 0, curve: false },
        { x: -5, y: -3, curve: true },
        { x: -11, y: -3, curve: true },
        { x: -16, y: -2, curve: false },
        { x: -14, y: 0, curve: false },
        { x: -17, y: 2, curve: false },
        { x: -10, y: 3, curve: true },
        { x: -5, y: 1, curve: true },
        { x: 0, y: 0, curve: false }
    ],
    LOD2: (grey = 255, colors = undefined) => {
        if (colors)
            return RectVisual(12, 2, -6, 0, 0, grey, 0, colors);
        return RectVisual(12, 2, -6, 0, 0, grey, 0);
    }
};
const PLUME_3_ARR = {
    LOD0: [
        { x: 0, y: 0, curve: false },
        { x: -3, y: -2, curve: true },
        { x: -6, y: -5, curve: true },
        { x: -10, y: -7, curve: true },
        { x: -14, y: -8, curve: true },
        { x: -17, y: -6, curve: true },
        { x: -19, y: -3, curve: false },
        { x: -16, y: -1, curve: true },
        { x: -13, y: 1, curve: true },
        { x: -9, y: 2, curve: true },
        { x: -5, y: 1.5, curve: true },
        { x: -2, y: 0.5, curve: true },
        { x: 0, y: 0, curve: false }
    ],
    LOD1: [
        { x: 0, y: 0, curve: false },
        { x: -6, y: -5, curve: true },
        { x: -14, y: -8, curve: true },
        { x: -19, y: -3, curve: false },
        { x: -13, y: 1, curve: true },
        { x: -5, y: 1.5, curve: true },
        { x: 0, y: 0, curve: false }
    ],
    LOD2: (grey = 255, colors = undefined) => {
        if (colors)
            return RectVisual(12, 2, -6, 0, 0, grey, 0, colors);
        return RectVisual(12, 2, -6, 0, 0, grey, 0);
    }
};
const PLUME_4_ARR = {
    LOD0: [
        { x: 0, y: 0, curve: false },
        { x: -3, y: -1, curve: true },
        { x: -6, y: -2, curve: true },
        { x: -9, y: -1, curve: true },
        { x: -12, y: 1, curve: true },
        { x: -15, y: 0, curve: true },
        { x: -18, y: -2, curve: true },
        { x: -20, y: -1, curve: false },
        { x: -17, y: 0.5, curve: true },
        { x: -13, y: 2, curve: true },
        { x: -9, y: 2, curve: true },
        { x: -5, y: 1, curve: true },
        { x: 0, y: 0, curve: false }
    ],
    LOD1: [
        { x: 0, y: 0, curve: false },
        { x: -6, y: -2, curve: true },
        { x: -12, y: 1, curve: true },
        { x: -18, y: -2, curve: true },
        { x: -20, y: -1, curve: false },
        { x: -13, y: 2, curve: true },
        { x: -5, y: 1, curve: true },
        { x: 0, y: 0, curve: false }
    ],
    LOD2: (grey = 255, colors = undefined) => {
        if (colors)
            return RectVisual(12, 2, -6, 0, 0, grey, 0, colors);
        return RectVisual(12, 2, -6, 0, 0, grey, 0);
    }
};
const PLUME_5_ARR = {
    LOD0: [
        { x: 0, y: 0, curve: false },
        { x: -3, y: -2, curve: true },
        { x: -7, y: -3, curve: true },
        { x: -11, y: -2, curve: true },
        { x: -15, y: -5, curve: true },
        { x: -18, y: -6, curve: false },
        { x: -15, y: -3, curve: false },
        { x: -13, y: -1, curve: true },
        { x: -17, y: 0, curve: false },
        { x: -13, y: 0.5, curve: true },
        { x: -16, y: 3, curve: true },
        { x: -18, y: 3, curve: false },
        { x: -14, y: 1.5, curve: true },
        { x: -10, y: 2, curve: true },
        { x: -6, y: 1, curve: true },
        { x: -3, y: 0.5, curve: true },
        { x: 0, y: 0, curve: false }
    ],
    LOD1: [
        { x: 0, y: 0, curve: false },
        { x: -7, y: -3, curve: true },
        { x: -15, y: -5, curve: true },
        { x: -18, y: -6, curve: false },
        { x: -13, y: -1, curve: true },
        { x: -17, y: 0, curve: false },
        { x: -13, y: 0.5, curve: true },
        { x: -18, y: 3, curve: false },
        { x: -10, y: 2, curve: true },
        { x: -3, y: 0.5, curve: true },
        { x: 0, y: 0, curve: false }
    ],
    LOD2: (grey = 255, colors = undefined) => {
        if (colors)
            return RectVisual(12, 2, -6, 0, 0, grey, 0, colors);
        return RectVisual(12, 2, -6, 0, 0, grey, 0);
    }
};
const PLUME_6_ARR = {
    LOD0: [
        { x: 0, y: 0, curve: false },
        { x: -3, y: 1, curve: true },
        { x: -6, y: 3, curve: true },
        { x: -9, y: 6, curve: true },
        { x: -12, y: 8, curve: true },
        { x: -15, y: 7, curve: true },
        { x: -17, y: 5, curve: false },
        { x: -14, y: 5, curve: true },
        { x: -11, y: 6, curve: true },
        { x: -8, y: 5, curve: true },
        { x: -5, y: 3, curve: true },
        { x: -2, y: 1, curve: true },
        { x: 0, y: 0, curve: false }
    ],
    LOD1: [
        { x: 0, y: 0, curve: false },
        { x: -6, y: 3, curve: true },
        { x: -12, y: 8, curve: true },
        { x: -17, y: 5, curve: false },
        { x: -11, y: 6, curve: true },
        { x: -5, y: 3, curve: true },
        { x: 0, y: 0, curve: false }
    ],
    LOD2: (grey = 255, colors = undefined) => {
        if (colors)
            return RectVisual(12, 2, -6, 0, 0, grey, 0, colors);
        return RectVisual(12, 2, -6, 0, 0, grey, 0);
    }
};
const PLUME_7_ARR = {
    LOD0: [
        { x: 0, y: 0, curve: false },
        { x: -2, y: -2, curve: true },
        { x: -4, y: -4, curve: true },
        { x: -6, y: -3, curve: true },
        { x: -8, y: -5, curve: false },
        { x: -9, y: -2, curve: true },
        { x: -11, y: -1, curve: false },
        { x: -9, y: 1, curve: true },
        { x: -11, y: 3, curve: false },
        { x: -8, y: 2, curve: true },
        { x: -6, y: 4, curve: false },
        { x: -5, y: 1.5, curve: true },
        { x: -2, y: 1, curve: true },
        { x: 0, y: 0, curve: false }
    ],
    LOD1: [
        { x: 0, y: 0, curve: false },
        { x: -4, y: -4, curve: true },
        { x: -8, y: -5, curve: false },
        { x: -11, y: -1, curve: false },
        { x: -11, y: 3, curve: false },
        { x: -6, y: 4, curve: false },
        { x: -2, y: 1, curve: true },
        { x: 0, y: 0, curve: false }
    ],
    LOD2: (grey = 255, colors = undefined) => {
        if (colors)
            return RectVisual(12, 2, -6, 0, 0, grey, 0, colors);
        return RectVisual(12, 2, -6, 0, 0, grey, 0);
    }
};
const PLUME_8_ARR = {
    LOD0: [
        { x: 0, y: 0, curve: false },
        { x: -4, y: -1, curve: true },
        { x: -8, y: -3, curve: true },
        { x: -12, y: -2, curve: true },
        { x: -16, y: 1, curve: true },
        { x: -20, y: 3, curve: true },
        { x: -23, y: 1, curve: false },
        { x: -20, y: 2, curve: true },
        { x: -16, y: 4, curve: true },
        { x: -12, y: 4, curve: true },
        { x: -8, y: 2, curve: true },
        { x: -4, y: 1, curve: true },
        { x: 0, y: 0, curve: false }
    ],
    LOD1: [
        { x: 0, y: 0, curve: false },
        { x: -8, y: -3, curve: true },
        { x: -16, y: 1, curve: true },
        { x: -23, y: 1, curve: false },
        { x: -16, y: 4, curve: true },
        { x: -8, y: 2, curve: true },
        { x: 0, y: 0, curve: false }
    ],
    LOD2: (grey = 255, colors = undefined) => {
        if (colors)
            return RectVisual(12, 2, -6, 0, 0, grey, 0, colors);
        return RectVisual(12, 2, -6, 0, 0, grey, 0);
    }
};
const PLUME_9_ARR = {
    LOD0: [
        { x: 0, y: 0, curve: false },
        { x: -2, y: -2, curve: true },
        { x: -5, y: -4, curve: true },
        { x: -8, y: -5, curve: true },
        { x: -11, y: -5, curve: true },
        { x: -14, y: -3, curve: true },
        { x: -17, y: -4, curve: false },
        { x: -15, y: -1, curve: true },
        { x: -18, y: 0, curve: false },
        { x: -15, y: 1, curve: true },
        { x: -12, y: 2, curve: true },
        { x: -9, y: 2, curve: true },
        { x: -6, y: 1.5, curve: true },
        { x: -3, y: 1, curve: true },
        { x: 0, y: 0, curve: false }
    ],
    LOD1: [
        { x: 0, y: 0, curve: false },
        { x: -5, y: -4, curve: true },
        { x: -11, y: -5, curve: true },
        { x: -17, y: -4, curve: false },
        { x: -18, y: 0, curve: false },
        { x: -12, y: 2, curve: true },
        { x: -6, y: 1.5, curve: true },
        { x: 0, y: 0, curve: false }
    ],
    LOD2: (grey = 255, colors = undefined) => {
        if (colors)
            return RectVisual(12, 2, -6, 0, 0, grey, 0, colors);
        return RectVisual(12, 2, -6, 0, 0, grey, 0);
    }
};

const CAPE_ARR = {
    LOD0: [
        { x: -1, y: -8, curve: false },
        { x: -4, y: -7, curve: true },
        { x: -7, y: -6, curve: true },
        { x: -10, y: -4, curve: true },
        { x: -13, y: -2, curve: true },
        { x: -15, y: 1, curve: true },
        { x: -14, y: 4, curve: true },
        { x: -16, y: 6, curve: false },
        { x: -13, y: 7, curve: false },
        { x: -15, y: 9, curve: false },
        { x: -10, y: 8.5, curve: false },
        { x: -8, y: 10, curve: false },
        { x: -6, y: 8, curve: false },
        { x: -6, y: 5, curve: true },
        { x: -5, y: 2, curve: true },
        { x: -4, y: -2, curve: true },
        { x: -2, y: -6, curve: true },
        { x: -1, y: -8, curve: false }
    ],
    LOD1: [
        { x: -1, y: -8, curve: false },
        { x: -6, y: -6, curve: true },
        { x: -11, y: -3, curve: true },
        { x: -15, y: 1, curve: true },
        { x: -14, y: 5, curve: false },
        { x: -10, y: 9, curve: false },
        { x: -6, y: 7, curve: false },
        { x: -5, y: 2, curve: true },
        { x: -2, y: -6, curve: true },
        { x: -1, y: -8, curve: false },
    ]
};

const CAPE_1_ARR = {
    LOD0: [
        { x: -1, y: -7, curve: false },
        { x: -5, y: -7, curve: true },
        { x: -9, y: -6, curve: true },
        { x: -13, y: -4, curve: true },
        { x: -17, y: -2, curve: true },
        { x: -20, y: 0, curve: false },
        { x: -17, y: 1, curve: false },
        { x: -19, y: 4, curve: false },
        { x: -15, y: 3, curve: false },
        { x: -17, y: 7, curve: false },
        { x: -12, y: 5, curve: false },
        { x: -9, y: 4, curve: true },
        { x: -6, y: 3, curve: true },
        { x: -5, y: 0, curve: true },
        { x: -3, y: -4, curve: true },
        { x: -1, y: -7, curve: false }
    ],
    LOD1: [
        { x: -1, y: -7, curve: false },
        { x: -7, y: -6, curve: true },
        { x: -13, y: -4, curve: true },
        { x: -20, y: 0, curve: false },
        { x: -16, y: 3, curve: false },
        { x: -12, y: 5, curve: false },
        { x: -7, y: 3, curve: true },
        { x: -4, y: 0, curve: true },
        { x: -1, y: -7, curve: false }
    ]
};

const CAPE_2_ARR = {
    LOD0: [
        { x: 0, y: -8, curve: false },
        { x: -1.5, y: -6, curve: true },
        { x: -3.5, y: -4, curve: true },
        { x: -3.5, y: 4, curve: true },
        { x: -1.5, y: 6, curve: true },
        { x: 0, y: 8, curve: false },
        { x: -1, y: 9, curve: false },
        { x: -2, y: 9.5, curve: false },
        { x: -9, y: 9.5, curve: false },
        { x: -8, y: 7, curve: false },
        { x: -7.5, y: 4, curve: false },
        { x: -7.5, y: -4, curve: false },
        { x: -8, y: -7, curve: false },
        { x: -9, y: -9.5, curve: false },
        { x: -2, y: -9.5, curve: false },
        { x: -1, y: -9, curve: false }
    ]
};

const CAPE_3_ARR = {
    LOD0: [
        { x: -1, y: -7, curve: false },
        { x: -4, y: -6, curve: true },
        { x: -7, y: -5, curve: true },
        { x: -10, y: -3, curve: true },
        { x: -12, y: 0, curve: true },
        { x: -12, y: 3, curve: true },
        { x: -14, y: 5, curve: false },
        { x: -11, y: 5.5, curve: false },
        { x: -13, y: 8, curve: false },
        { x: -9, y: 7, curve: false },
        { x: -7, y: 9, curve: false },
        { x: -6, y: 5, curve: true },
        { x: -5, y: 2, curve: true },
        { x: -4, y: -2, curve: true },
        { x: -2, y: -6, curve: true },
        { x: -1, y: -7, curve: false }
    ],
    LOD1: [
        { x: -1, y: -7, curve: false },
        { x: -7, y: -5, curve: true },
        { x: -12, y: 0, curve: true },
        { x: -14, y: 5, curve: false },
        { x: -9, y: 8, curve: false },
        { x: -6, y: 5, curve: true },
        { x: -4, y: 0, curve: true },
        { x: -1, y: -7, curve: false }
    ]
}

const HORSE_ARR = [
    { x: 10, y: 2.5, curve: true },
    { x: 20, y: 2.5, curve: true },
    { x: 22.5, y: 0, curve: true },
    { x: 20, y: -2.5, curve: true },
    { x: 10, y: -2.5, curve: true }
];

// DEFINED VISUALS FOR UNITS/WEAPONS/PROJECTILES
// TROOPS
const MAN_VISUAL = {
    LOD0: [
        RectVisual(4, 15, 0, 0, 0, 190, 0, STOCK_COLORS.WHITE),
        CircleVisual(10, 10, 0, 0, 255, 0)
    ],
    LOD1: [
        RectVisual(4, 15, 0, 0, 0, 190, 0, STOCK_COLORS.WHITE),
        CircleVisual(10, 10, 0, 0, 255, 0)
    ],
    LOD2: [
        RectVisual(4, 15, 0, 0, 0, 190, 0, STOCK_COLORS.WHITE),
        CircleVisual(10, 10, 0, 0, 255, 0)
    ]
};

const SHIELDED_SOLDIER_VISUAL = {
    LOD0: [
        RectVisual(4, 15, 0, 0, 0, 190, 0, STOCK_COLORS.WHITE),
        CircleVisual(10, 10, 0, 0, 255, 0),
        RectVisual(4, 15, 0, 0, 0, 190, 0, STOCK_COLORS.ENERGY),
        CircleVisual(10, 10, 0, 0, 255, 0, STOCK_COLORS.ENERGY)
    ],
    LOD1: [
        RectVisual(4, 15, 0, 0, 0, 190, 0, STOCK_COLORS.WHITE),
        CircleVisual(10, 10, 0, 0, 255, 0),
        RectVisual(4, 15, 0, 0, 0, 190, 0, STOCK_COLORS.ENERGY),
        CircleVisual(10, 10, 0, 0, 255, 0, STOCK_COLORS.ENERGY)
    ],
    LOD2: [
        RectVisual(4, 15, 0, 0, 0, 190, 0, STOCK_COLORS.WHITE),
        CircleVisual(10, 10, 0, 0, 255, 0),
        RectVisual(4, 15, 0, 0, 0, 190, 0, STOCK_COLORS.ENERGY),
        CircleVisual(10, 10, 0, 0, 255, 0, STOCK_COLORS.ENERGY)
    ]
};

const TANK_VISUAL = {
    LOD0: [
        new Visual(function (x, y, cols, timeElapsed) {
            const shaded = cols.map(c => c * 0.94);

            push();
            translate(x, y);
            rectMode(CENTER);
            strokeWeight(0);
            for (let i = 31.25; i > -32.5; i -= 5) {
                fill(150);
                rect(i, -26, 2.5, 4.5);
                rect(i, 26, 2.5, 4.5);
                fill(170);
                rect(i - 2.5, -26, 2.5, 4.5);
                rect(i - 2.5, 26, 2.5, 4.5);
            }
            fill(...cols);
            rect(0, -20, 70, 10);
            rect(0, 20, 70, 10);
            fill(...shaded);
            rect(0, 0, 50, 30);
            pop();
        }, 255)
    ],
    LOD1: [
        new Visual(function (x, y, cols, timeElapsed) {
            const shaded = cols.map(c => c * 0.94);

            push();
            translate(x, y);
            rectMode(CENTER);
            strokeWeight(0);
            for (let i = 30; i > -30; i -= 10) {
                fill(150);
                rect(i, -26, 5, 4.5);
                rect(i, 26, 5, 4.5);
                fill(170);
                rect(i - 5, -26, 5, 4.5);
                rect(i - 5, 26, 5, 4.5);
            }
            fill(150);
            rect(-30, -26, 5, 4.5);
            rect(-30, 26, 5, 4.5);
            fill(...cols);
            rect(0, -20, 70, 10);
            rect(0, 20, 70, 10);
            fill(...shaded);
            rect(0, 0, 50, 30);
            pop();
        }, 255)
    ],
    LOD2: [
        new Visual(function (x, y, cols, timeElapsed) {
            const shaded = cols.map(c => c * 0.94);

            push();
            translate(x, y);
            rectMode(CENTER);
            strokeWeight(0);
            fill(160);
            rect(0, 26, 65, 4);
            rect(0, -26, 65, 4);
            fill(...cols);
            rect(0, -20, 70, 10);
            rect(0, 20, 70, 10);
            fill(...shaded);
            rect(0, 0, 50, 30);
            pop();
        }, 255)
    ]
};


const TANK_MOVING_VISUAL = {
    LOD0: [
        new Visual(function (x, y, cols, timeElapsed) {
            const shaded = cols.map(c => c * 0.94);

            push();
            translate(x, y);
            rectMode(CENTER);
            strokeWeight(0);

            const spacing = 5;
            const linkWidth = 2.5;
            const treadMin = -32.5;
            const treadMax = 32.5;
            const offset = (timeElapsed * 10) % spacing;

            for (const side of [-26, 26]) {
                for (
                    let i = treadMin - spacing + offset;
                    i < treadMax;
                    i += spacing
                ) {
                    const left = i;
                    const right = i + linkWidth;

                    const clippedLeft = Math.max(left, treadMin);
                    const clippedRight = Math.min(right, treadMax);
                    const width = clippedRight - clippedLeft;

                    if (width > 0) {
                        fill(150);
                        rect(
                            (clippedLeft + clippedRight) / 2,
                            side,
                            width,
                            4.5
                        );
                    }
                    const gapLeft = i + linkWidth;
                    const gapRight = i + spacing;

                    const clippedGapLeft = Math.max(gapLeft, treadMin);
                    const clippedGapRight = Math.min(gapRight, treadMax);
                    const gapWidth = clippedGapRight - clippedGapLeft;

                    if (gapWidth > 0) {
                        fill(170);
                        rect(
                            (clippedGapLeft + clippedGapRight) / 2,
                            side,
                            gapWidth,
                            4.5
                        );
                    }
                }
            }
            fill(...cols);
            rect(0, -20, 70, 10);
            rect(0, 20, 70, 10);
            fill(...shaded);
            rect(0, 0, 50, 30);
            pop();
        }, 255)
    ],
    LOD1: [
        new Visual(function (x, y, cols, timeElapsed) {
            const shaded = cols.map(c => c * 0.94);

            push();
            translate(x, y);
            rectMode(CENTER);
            strokeWeight(0);
            const spacing = 5;
            const linkWidth = 2.5;
            const treadMin = -32.5;
            const treadMax = 32.5;
            const offset = (timeElapsed * 10) % spacing;
            for (const side of [-26, 26]) {
                for (
                    let i = treadMin - spacing + offset;
                    i < treadMax;
                    i += spacing
                ) {
                    const left = i;
                    const right = i + linkWidth;

                    const clippedLeft = Math.max(left, treadMin);
                    const clippedRight = Math.min(right, treadMax);
                    const width = clippedRight - clippedLeft;

                    if (width > 0) {
                        fill(150);
                        rect(
                            (clippedLeft + clippedRight) / 2,
                            side,
                            width,
                            4.5
                        );
                    }
                    const gapLeft = i + linkWidth;
                    const gapRight = i + spacing;

                    const clippedGapLeft = Math.max(gapLeft, treadMin);
                    const clippedGapRight = Math.min(gapRight, treadMax);
                    const gapWidth = clippedGapRight - clippedGapLeft;

                    if (gapWidth > 0) {
                        fill(170);
                        rect(
                            (clippedGapLeft + clippedGapRight) / 2,
                            side,
                            gapWidth,
                            4.5
                        );
                    }
                }
            }
            fill(...cols);
            rect(0, -20, 70, 10);
            rect(0, 20, 70, 10);
            fill(...shaded);
            rect(0, 0, 50, 30);
            pop();
        }, 255)
    ],
    LOD2: [
        new Visual(function (x, y, cols, timeElapsed) {
            const shaded = cols.map(c => c * 0.94);

            push();
            translate(x, y);
            rectMode(CENTER);
            strokeWeight(0);
            fill(160);
            rect(0, 26, 65, 4);
            rect(0, -26, 65, 4);
            fill(...cols);
            rect(0, -20, 70, 10);
            rect(0, 20, 70, 10);
            fill(...shaded);
            rect(0, 0, 50, 30);
            pop();
        }, 255)
    ]
};

const CITADEL_VISUAL = {
    LOD0: [
        CircleOutlineVisual(150, 150, 25, 0, 0, 190, STOCK_COLORS.WHITE),
        RectVisual(15, 35, 0, 62.5, 0, 150, 0, STOCK_COLORS.WHITE),
        RectVisual(15, 35, 0, -62.5, 0, 150, 0, STOCK_COLORS.WHITE),
        RectVisual(35, 15, 62.5, 0, 0, 150, 0, STOCK_COLORS.WHITE),
        RectVisual(35, 15, -62.5, 0, 0, 150, 0, STOCK_COLORS.WHITE)
    ],
    LOD1: [
        CircleOutlineVisual(150, 150, 25, 0, 0, 190, STOCK_COLORS.WHITE),
        RectVisual(15, 35, 0, 62.5, 0, 150, 0, STOCK_COLORS.WHITE),
        RectVisual(15, 35, 0, -62.5, 0, 150, 0, STOCK_COLORS.WHITE),
        RectVisual(35, 15, 62.5, 0, 0, 150, 0, STOCK_COLORS.WHITE),
        RectVisual(35, 15, -62.5, 0, 0, 150, 0, STOCK_COLORS.WHITE)
    ],
    LOD2: [
        CircleOutlineVisual(150, 150, 25, 0, 0, 190, STOCK_COLORS.WHITE),
        RectVisual(15, 35, 0, 62.5, 0, 150, 0, STOCK_COLORS.WHITE),
        RectVisual(15, 35, 0, -62.5, 0, 150, 0, STOCK_COLORS.WHITE),
        RectVisual(35, 15, 62.5, 0, 0, 150, 0, STOCK_COLORS.WHITE),
        RectVisual(35, 15, -62.5, 0, 0, 150, 0, STOCK_COLORS.WHITE)
    ]
};

const ASSAULT_VISUAL = {
    LOD0: [
        RectVisual(4, 15, 0, 0, 0, 255, 0, [120, 134, 107, 255]),
        RectVisual(5, 11, -4.5, 0, 0, 160, 0, STOCK_COLORS.WHITE),
        CircleVisual(10, 10, 0, 0, 255, 0)
    ],
    LOD1: [
        RectVisual(4, 15, 0, 0, 0, 255, 0, [120, 134, 107, 255]),
        RectVisual(5, 11, -4.5, 0, 0, 160, 0, STOCK_COLORS.WHITE),
        CircleVisual(10, 10, 0, 0, 255, 0)
    ],
    LOD2: [
        RectVisual(4, 15, 0, 0, 0, 255, 0, [120, 134, 107, 255]),
        CircleVisual(10, 10, 0, 0, 255, 0)
    ]
};

const HOWITZER_VISUAL = {
    LOD0: [
        RectVisual(24, 3, -12, 8, -Math.PI / 8, 150, 1, STOCK_COLORS.WHITE),
        RectVisual(24, 3, -12, -8, Math.PI / 8, 150, 1, STOCK_COLORS.WHITE),
        RectVisual(2, 30, 8, 0, 0, 150, 1, STOCK_COLORS.WHITE),
        RectVisual(4, 30, 0, 0, 0, 190, 1, STOCK_COLORS.WHITE),
        RectVisual(10, 10, 0, -10, 0, 170, 1, STOCK_COLORS.WHITE),
        RectVisual(10, 10, 0, 10, 0, 170, 1, STOCK_COLORS.WHITE)
    ],
    LOD1: [
        RectVisual(24, 3, -12, 8, -Math.PI / 8, 150, 1, STOCK_COLORS.WHITE),
        RectVisual(24, 3, -12, -8, Math.PI / 8, 150, 1, STOCK_COLORS.WHITE),
        RectVisual(2, 30, 8, 0, 0, 150, 1, STOCK_COLORS.WHITE),
        RectVisual(4, 30, 0, 0, 0, 190, 1, STOCK_COLORS.WHITE),
        RectVisual(10, 10, 0, -10, 0, 170, 1, STOCK_COLORS.WHITE),
        RectVisual(10, 10, 0, 10, 0, 170, 1, STOCK_COLORS.WHITE)
    ],
    LOD2: [
        RectVisual(24, 3, -12, 8, -Math.PI / 8, 150, 1, STOCK_COLORS.WHITE),
        RectVisual(24, 3, -12, -8, Math.PI / 8, 150, 1, STOCK_COLORS.WHITE),
        RectVisual(14, 30, 2, 0, 0, 170, 1, STOCK_COLORS.WHITE)
    ],
};

const ART_CANNON_VISUAL = {
    LOD0: [
        RectVisual(3, 3, 33.5, 0, 0, 220, 1, STOCK_COLORS.WHITE),
        RectVisual(20, 1, 25, 0, 0, 220, 1, STOCK_COLORS.WHITE),
        RectVisual(10, 3, 10, 0, 0, 200, 1, STOCK_COLORS.WHITE),
        RectVisual(10, 5, 0, 0, 0, 180, 1, STOCK_COLORS.WHITE)
    ],
    LOD1: [
        RectVisual(20, 1, 25, 0, 0, 220, 1, STOCK_COLORS.WHITE),
        RectVisual(10, 3, 10, 0, 0, 200, 1, STOCK_COLORS.WHITE),
        RectVisual(10, 5, 0, 0, 0, 180, 1, STOCK_COLORS.WHITE)
    ],
    LOD2: [
        TriangleVisual(-5, 2.5, -5, -2.5, 35, 0, 200, 1, STOCK_COLORS.WHITE)
    ],
};

const LANCER_VISUAL = {
    LOD0: [
        new Visual(function(x, y, cols, timeElapsed=0) {
            push()
            translate(x, y);
            fill(140);
            strokeWeight(0);
            rectMode(CENTER);
            rect(0, 0, 20, 8);
            fill(180);
            stroke(160);
            strokeWeight(0.5);
            beginShape();
            splineVertex(22.5, 0);
            splineVertex(17.5, -4);
            splineVertex(7.5, -5);
            vertex(7.5, -5);
            vertex(5, 0);
            vertex(7.5, 5);
            splineVertex(7.5, 5);
            splineVertex(17.5, 4);
            splineVertex(22.5, 0);
            endShape(CLOSE);

            beginShape();
            vertex(-22.5, -5);
            vertex(-11, -5);
            splineVertex(-11, -5);
            splineVertex(-10, -3);
            splineVertex(-5, 0);
            vertex(-5, 0);
            splineVertex(-5, 0);
            splineVertex(-10, 3);
            splineVertex(-11, 5);
            vertex(-11, 5);
            vertex(-22.5, 5);
            endShape(CLOSE);
            arc(-22, 0, 2.5, 10, HALF_PI, HALF_PI + PI);

            pop();
        }, 255),
        // RectVisual(30, 10, -7.5, 0, 0, 255, 0, [200, 200, 200, 255]),
        // CircleVisual(30, 10, 7.5, 0, 255, 0, [200, 200, 200, 255]),
        armoredBody(150, 255, STOCK_COLORS.WHITE, undefined, CAPE_ARR.LOD0),
        // RectVisual(4, 15, 0, 0, 0, 150, 0, STOCK_COLORS.WHITE),
        // ShapeVisual(CAPE_ARR.LOD0, 255, 1),
        CircleVisual(10, 10, 0, 0, 175, 0, STOCK_COLORS.WHITE),
        ShapeVisual(PLUME_8_ARR.LOD0, 180, 0)
    ],
    LOD1: [
        new Visual(function(x, y, cols, timeElapsed=0) {
            push()
            translate(x, y);
            fill(180);
            stroke(160);
            strokeWeight(0.5);
            beginShape();
            splineVertex(22.5, 0);
            splineVertex(17.5, -4);
            splineVertex(7.5, -5);
            vertex(7.5, -5);
            vertex(-11, -5);
            vertex(-22.5, -5);
            vertex(-22.5, 5);
            vertex(-11, 5);
            vertex(7.5, 5);
            splineVertex(7.5, 5);
            splineVertex(17.5, 4);
            splineVertex(22.5, 0);
            endShape(CLOSE);

            pop();
        }, 255),
        armoredBody(150, 255, STOCK_COLORS.WHITE, undefined, CAPE_ARR.LOD1),
        // RectVisual(4, 15, 0, 0, 0, 150, 0, STOCK_COLORS.WHITE),
        // ShapeVisual(CAPE_ARR.LOD0, 255, 1),
        CircleVisual(10, 10, 0, 0, 175, 0, STOCK_COLORS.WHITE),
        ShapeVisual(PLUME_8_ARR.LOD1, 180, 0)
    ],
    LOD2: [
        RectVisual(30, 10, -7.5, 0, 0, 180, 0, STOCK_COLORS.WHITE),
        CircleVisual(30, 10, 7.5, 0, 180, 0, STOCK_COLORS.WHITE),
        RectVisual(20, 14, -10, 0, 0, 255, 0),
        RectVisual(4, 15, 0, 0, 0, 150, 0, STOCK_COLORS.WHITE),
        CircleVisual(10, 10, 0, 0, 175, 0, STOCK_COLORS.WHITE),
        PLUME_8_ARR.LOD2(180)
    ]
};
const LANCER_1_VISUAL = {
    LOD0: [
        new Visual(function(x, y, cols, timeElapsed=0) {
            push()
            translate(x, y);
            fill(140);
            strokeWeight(0);
            rectMode(CENTER);
            rect(0, 0, 20, 8);
            fill(180);
            stroke(160);
            strokeWeight(0.5);
            beginShape();
            splineVertex(22.5, 0);
            splineVertex(17.5, -4);
            splineVertex(7.5, -5);
            vertex(7.5, -5);
            vertex(5, 0);
            vertex(7.5, 5);
            splineVertex(7.5, 5);
            splineVertex(17.5, 4);
            splineVertex(22.5, 0);
            endShape(CLOSE);

            beginShape();
            vertex(-22.5, -5);
            vertex(-11, -5);
            splineVertex(-11, -5);
            splineVertex(-10, -3);
            splineVertex(-5, 0);
            vertex(-5, 0);
            splineVertex(-5, 0);
            splineVertex(-10, 3);
            splineVertex(-11, 5);
            vertex(-11, 5);
            vertex(-22.5, 5);
            endShape(CLOSE);
            arc(-22, 0, 2.5, 10, HALF_PI, HALF_PI + PI);

            pop();
        }, 255),
        armoredBody(150, 255, STOCK_COLORS.WHITE, undefined, CAPE_2_ARR.LOD0),
        // RectVisual(4, 15, 0, 0, 0, 150, 0, STOCK_COLORS.WHITE),
        // ShapeVisual(CAPE_2_ARR.LOD0, 255, 1),
        CircleVisual(10, 10, 0, 0, 175, 0, STOCK_COLORS.WHITE),
        ShapeVisual(PLUME_2_ARR.LOD0, 180, 0)
    ],
    LOD1: [
        new Visual(function(x, y, cols, timeElapsed=0) {
            push()
            translate(x, y);
            fill(180);
            stroke(160);
            strokeWeight(0.5);
            beginShape();
            splineVertex(22.5, 0);
            splineVertex(17.5, -4);
            splineVertex(7.5, -5);
            vertex(7.5, -5);
            vertex(-11, -5);
            vertex(-22.5, -5);
            vertex(-22.5, 5);
            vertex(-11, 5);
            vertex(7.5, 5);
            splineVertex(7.5, 5);
            splineVertex(17.5, 4);
            splineVertex(22.5, 0);
            endShape(CLOSE);

            pop();
        }, 255),
        RectVisual(4, 15, 0, 0, 0, 150, 0, STOCK_COLORS.WHITE),
        RectVisual(9, 16, -4.5, 0, 0, 255, 0),
        CircleVisual(10, 10, 0, 0, 175, 0, STOCK_COLORS.WHITE),
        ShapeVisual(PLUME_2_ARR.LOD1, 180, 0)
    ],
    LOD2: [
        RectVisual(30, 10, -7.5, 0, 0, 180, 0, STOCK_COLORS.WHITE),
        CircleVisual(30, 10, 7.5, 0, 180, 0, STOCK_COLORS.WHITE),
        RectVisual(20, 14, -10, 0, 0, 255, 0),
        RectVisual(4, 15, 0, 0, 0, 150, 0, STOCK_COLORS.WHITE),
        CircleVisual(10, 10, 0, 0, 175, 0, STOCK_COLORS.WHITE),
        PLUME_2_ARR.LOD2(180)
    ]
};
const LANCER_2_VISUAL = {
    LOD0: [
        new Visual(function(x, y, cols, timeElapsed=0) {
            push()
            translate(x, y);
            fill(140);
            strokeWeight(0);
            rectMode(CENTER);
            rect(0, 0, 20, 8);
            fill(180);
            stroke(160);
            strokeWeight(0.5);
            beginShape();
            splineVertex(22.5, 0);
            splineVertex(17.5, -4);
            splineVertex(7.5, -5);
            vertex(7.5, -5);
            vertex(5, 0);
            vertex(7.5, 5);
            splineVertex(7.5, 5);
            splineVertex(17.5, 4);
            splineVertex(22.5, 0);
            endShape(CLOSE);

            beginShape();
            vertex(-22.5, -5);
            vertex(-11, -5);
            splineVertex(-11, -5);
            splineVertex(-10, -3);
            splineVertex(-5, 0);
            vertex(-5, 0);
            splineVertex(-5, 0);
            splineVertex(-10, 3);
            splineVertex(-11, 5);
            vertex(-11, 5);
            vertex(-22.5, 5);
            endShape(CLOSE);
            arc(-22, 0, 2.5, 10, HALF_PI, HALF_PI + PI);

            pop();
        }, 255),
        armoredBody(150, 255, STOCK_COLORS.WHITE, undefined, CAPE_1_ARR.LOD0),
        // RectVisual(4, 15, 0, 0, 0, 150, 0, STOCK_COLORS.WHITE),
        // ShapeVisual(CAPE_1_ARR.LOD0, 255, 1),
        CircleVisual(10, 10, 0, 0, 175, 0, STOCK_COLORS.WHITE),
        ShapeVisual(PLUME_2_ARR.LOD0, 180, 0)
    ],
    LOD1: [
        new Visual(function(x, y, cols, timeElapsed=0) {
            push()
            translate(x, y);
            fill(180);
            stroke(160);
            strokeWeight(0.5);
            beginShape();
            splineVertex(22.5, 0);
            splineVertex(17.5, -4);
            splineVertex(7.5, -5);
            vertex(7.5, -5);
            vertex(-11, -5);
            vertex(-22.5, -5);
            vertex(-22.5, 5);
            vertex(-11, 5);
            vertex(7.5, 5);
            splineVertex(7.5, 5);
            splineVertex(17.5, 4);
            splineVertex(22.5, 0);
            endShape(CLOSE);

            pop();
        }, 255),
        armoredBody(150, 255, STOCK_COLORS.WHITE, undefined, CAPE_1_ARR.LOD1),
        // RectVisual(4, 15, 0, 0, 0, 150, 0, STOCK_COLORS.WHITE),
        // ShapeVisual(CAPE_1_ARR.LOD0, 255, 1),
        CircleVisual(10, 10, 0, 0, 175, 0, STOCK_COLORS.WHITE),
        ShapeVisual(PLUME_2_ARR.LOD1, 180, 0)
    ],
    LOD2: [
        RectVisual(30, 10, -7.5, 0, 0, 180, 0, STOCK_COLORS.WHITE),
        CircleVisual(30, 10, 7.5, 0, 180, 0, STOCK_COLORS.WHITE),
        RectVisual(20, 14, -10, 0, 0, 255, 0),
        RectVisual(4, 15, 0, 0, 0, 150, 0, STOCK_COLORS.WHITE),
        CircleVisual(10, 10, 0, 0, 175, 0, STOCK_COLORS.WHITE),
        PLUME_2_ARR.LOD2(180)
    ]
};
const LANCER_3_VISUAL = {
    LOD0: [
        new Visual(function(x, y, cols, timeElapsed=0) {
            push()
            translate(x, y);
            fill(140);
            strokeWeight(0);
            rectMode(CENTER);
            rect(0, 0, 20, 8);
            fill(180);
            stroke(160);
            strokeWeight(0.5);
            beginShape();
            splineVertex(22.5, 0);
            splineVertex(17.5, -4);
            splineVertex(7.5, -5);
            vertex(7.5, -5);
            vertex(5, 0);
            vertex(7.5, 5);
            splineVertex(7.5, 5);
            splineVertex(17.5, 4);
            splineVertex(22.5, 0);
            endShape(CLOSE);

            beginShape();
            vertex(-22.5, -5);
            vertex(-11, -5);
            splineVertex(-11, -5);
            splineVertex(-10, -3);
            splineVertex(-5, 0);
            vertex(-5, 0);
            splineVertex(-5, 0);
            splineVertex(-10, 3);
            splineVertex(-11, 5);
            vertex(-11, 5);
            vertex(-22.5, 5);
            endShape(CLOSE);
            arc(-22, 0, 2.5, 10, HALF_PI, HALF_PI + PI);

            pop();
        }, 255),
        armoredBody(150, 255, STOCK_COLORS.WHITE, undefined, CAPE_3_ARR.LOD0),
        // RectVisual(4, 15, 0, 0, 0, 150, 0, STOCK_COLORS.WHITE),
        // ShapeVisual(CAPE_3_ARR.LOD0, 255, 1),
        CircleVisual(10, 10, 0, 0, 175, 0, STOCK_COLORS.WHITE),
        ShapeVisual(PLUME_1_ARR.LOD0, 180, 0)
    ],
    LOD1: [
        new Visual(function(x, y, cols, timeElapsed=0) {
            push()
            translate(x, y);
            fill(180);
            stroke(160);
            strokeWeight(0.5);
            beginShape();
            splineVertex(22.5, 0);
            splineVertex(17.5, -4);
            splineVertex(7.5, -5);
            vertex(7.5, -5);
            vertex(-11, -5);
            vertex(-22.5, -5);
            vertex(-22.5, 5);
            vertex(-11, 5);
            vertex(7.5, 5);
            splineVertex(7.5, 5);
            splineVertex(17.5, 4);
            splineVertex(22.5, 0);
            endShape(CLOSE);

            pop();
        }, 255),
        armoredBody(150, 255, STOCK_COLORS.WHITE, undefined, CAPE_3_ARR.LOD1),
        // RectVisual(4, 15, 0, 0, 0, 150, 0, STOCK_COLORS.WHITE),
        // ShapeVisual(CAPE_3_ARR.LOD0, 255, 1),
        CircleVisual(10, 10, 0, 0, 175, 0, STOCK_COLORS.WHITE),
        ShapeVisual(PLUME_1_ARR.LOD1, 180, 0)
    ],
    LOD2: [
        RectVisual(30, 10, -7.5, 0, 0, 180, 0, STOCK_COLORS.WHITE),
        CircleVisual(30, 10, 7.5, 0, 180, 0, STOCK_COLORS.WHITE),
        RectVisual(20, 14, -10, 0, 0, 255, 0),
        RectVisual(4, 15, 0, 0, 0, 150, 0, STOCK_COLORS.WHITE),
        CircleVisual(10, 10, 0, 0, 175, 0, STOCK_COLORS.WHITE),
        PLUME_1_ARR.LOD2(180)
    ]
};

const HORSE_COLORS = [
    [163, 99, 20, 255],
    [66, 39, 20, 255],
    [90, 65, 49, 255],
    [169, 149, 128, 255],
    STOCK_COLORS.BONE
]
function horseVisual(lod=LOD.LOD0, horseColorIndex=0, grey=255, bardingColors=undefined) {
    let visual;
    switch (lod) {
        case LOD.LOD0:
            visual = new Visual(function(x, y, cols, timeElapsed) {
                const colors = (bardingColors ? bardingColors : cols).map(c => c * this.shade);
                if (colors.length > 3) colors[3] = (bardingColors ? bardingColors : cols)[3];
                push();
                translate(x, y);
                rectMode(CENTER);
                strokeWeight(0);

                fill(...colors);
                rect(-2.5, 0, 35, 10);
                ellipse(15, 0, 10);

                fill(...this.horseCols);
                beginShape();
                splineVertex(10, 3.5);
                splineVertex(15, 2.5);
                splineVertex(20, 2.5);
                splineVertex(22.5, 0);
                splineVertex(20, -2.5);
                splineVertex(15, -2.5);
                splineVertex(10, -3.5);
                splineVertex(8, 0);
                endShape(CLOSE);
                triangle(9, 2.5, 12, 2.5, 10.5, 5);
                triangle(9, -2.5, 12, -2.5, 10.5, -5);

                pop();
            }, grey);
            break;
        case LOD.LOD1:
            visual = new Visual(function(x, y, cols, timeElapsed) {
                const colors = (bardingColors ? bardingColors : cols).map(c => c * this.shade);
                if (colors.length > 3) colors[3] = (bardingColors ? bardingColors : cols)[3];
                push();
                translate(x, y);
                rectMode(CENTER);
                strokeWeight(0);

                fill(...colors);
                rect(-2.5, 0, 35, 10);
                ellipse(15, 0, 10);

                fill(...this.horseCols);
                rect(15, 0, 14, 5);

                pop();
            }, grey);
            break;
        case LOD.LOD2:
            visual = new Visual(function(x, y, cols, timeElapsed) {
                const colors = (bardingColors ? bardingColors : cols).map(c => c * this.shade);
                if (colors.length > 3) colors[3] = (bardingColors ? bardingColors : cols)[3];
                push();
                translate(x, y);
                rectMode(CENTER);
                strokeWeight(0);

                fill(...colors);
                rect(-2.5, 0, 35, 10);
                ellipse(15, 0, 10);
                
                pop();
            }, grey);
            break;
    }
    visual.horseCols = HORSE_COLORS[horseColorIndex];
    return visual;
}

const HORSEMAN_VISUAL = {
    LOD0: [
        horseVisual(LOD.LOD0, 3, 200, STOCK_COLORS.SCARLET),
        armoredBody(150, 200, STOCK_COLORS.WHITE, STOCK_COLORS.CRIMSON, CAPE_2_ARR.LOD0),
        CircleVisual(10, 10, 0, 0, 175, 0, STOCK_COLORS.WHITE),
        ShapeVisual(PLUME_2_ARR.LOD0, 180, 0)
    ],

    LOD1: [
        horseVisual(LOD.LOD1, 3, 200, STOCK_COLORS.SCARLET),
        armoredBody(150, 200, STOCK_COLORS.WHITE, STOCK_COLORS.CRIMSON, CAPE_3_ARR.LOD1),
        CircleVisual(10, 10, 0, 0, 175, 0, STOCK_COLORS.WHITE),
        ShapeVisual(PLUME_2_ARR.LOD1, 180, 0)
    ],

    LOD2: [
        horseVisual(LOD.LOD2, 3, 200, STOCK_COLORS.SCARLET),
        RectVisual(9, 12, -4.5, 0, 0, 200, 0, STOCK_COLORS.CRIMSON),
        RectVisual(4, 15, 0, 0, 0, 150, 0, STOCK_COLORS.WHITE),
        CircleVisual(10, 10, 0, 0, 175, 0, STOCK_COLORS.WHITE),
        PLUME_2_ARR.LOD2(180)
    ]
};
const HORSEMAN_1_VISUAL = {
    LOD0: [
        horseVisual(LOD.LOD0, 1, 200, STOCK_COLORS.ROYALBLUE),
        armoredBody(150, 255, STOCK_COLORS.WHITE, STOCK_COLORS.TEAL, CAPE_ARR.LOD0),
        CircleVisual(10, 10, 0, 0, 175, 0, STOCK_COLORS.WHITE),
        ShapeVisual(PLUME_8_ARR.LOD0, 180, 0)
    ],

    LOD1: [
        horseVisual(LOD.LOD1, 1, 200, STOCK_COLORS.ROYALBLUE),
        armoredBody(150, 255, STOCK_COLORS.WHITE, STOCK_COLORS.TEAL, CAPE_ARR.LOD1),
        CircleVisual(10, 10, 0, 0, 175, 0, STOCK_COLORS.WHITE),
        ShapeVisual(PLUME_8_ARR.LOD1, 180, 0)
    ],

    LOD2: [
        horseVisual(LOD.LOD2, 1, 200, STOCK_COLORS.ROYALBLUE),
        RectVisual(9, 12, -4.5, 0, 0, 255, 0, STOCK_COLORS.TEAL),
        RectVisual(4, 15, 0, 0, 0, 150, 0, STOCK_COLORS.WHITE),
        CircleVisual(10, 10, 0, 0, 175, 0, STOCK_COLORS.WHITE),
        PLUME_8_ARR.LOD2(180)
    ]
};
const HORSEMAN_2_VISUAL = {
    LOD0: [
        horseVisual(LOD.LOD0, 2, 200, STOCK_COLORS.EMERALD),
        armoredBody(150, 255, STOCK_COLORS.WHITE, STOCK_COLORS.EMERALD, CAPE_1_ARR.LOD0),
        CircleVisual(10, 10, 0, 0, 175, 0, STOCK_COLORS.WHITE),
        ShapeVisual(PLUME_2_ARR.LOD0, 180, 0)
    ],

    LOD1: [
        horseVisual(LOD.LOD1, 2, 200, STOCK_COLORS.EMERALD),
        armoredBody(150, 255, STOCK_COLORS.WHITE, STOCK_COLORS.EMERALD, CAPE_1_ARR.LOD1),
        CircleVisual(10, 10, 0, 0, 175, 0, STOCK_COLORS.WHITE),
        ShapeVisual(PLUME_2_ARR.LOD1, 180, 0)
    ],

    LOD2: [
        horseVisual(LOD.LOD2, 2, 200, STOCK_COLORS.EMERALD),
        RectVisual(9, 12, -4.5, 0, 0, 255, 0, STOCK_COLORS.EMERALD),
        RectVisual(4, 15, 0, 0, 0, 150, 0, STOCK_COLORS.WHITE),
        CircleVisual(10, 10, 0, 0, 175, 0, STOCK_COLORS.WHITE),
        PLUME_2_ARR.LOD2(180)
    ]
};
const HORSEMAN_3_VISUAL = {
    LOD0: [
        horseVisual(LOD.LOD0, 0, 150, STOCK_COLORS.PURPLE),
        armoredBody(150, 255, STOCK_COLORS.WHITE, STOCK_COLORS.PURPLE, CAPE_3_ARR.LOD0),
        CircleVisual(10, 10, 0, 0, 175, 0, STOCK_COLORS.WHITE),
        ShapeVisual(PLUME_1_ARR.LOD0, 200, 0)
    ],

    LOD1: [
        horseVisual(LOD.LOD1, 0, 150, STOCK_COLORS.PURPLE),
        armoredBody(150, 255, STOCK_COLORS.WHITE, STOCK_COLORS.PURPLE, CAPE_3_ARR.LOD1),
        CircleVisual(10, 10, 0, 0, 175, 0, STOCK_COLORS.WHITE),
        ShapeVisual(PLUME_1_ARR.LOD1, 200, 0)
    ],

    LOD2: [
        horseVisual(LOD.LOD2, 0, 150, STOCK_COLORS.PURPLE),
        RectVisual(9, 12, -4.5, 0, 0, 255, 0, STOCK_COLORS.PURPLE),
        RectVisual(4, 15, 0, 0, 0, 150, 0, STOCK_COLORS.WHITE),
        CircleVisual(10, 10, 0, 0, 175, 0, STOCK_COLORS.WHITE),
        PLUME_1_ARR.LOD2(200)
    ]
};

const DULLAHAN_VISUAL = {
    LOD0: [
        horseVisual(LOD.LOD0, 4, 255, STOCK_COLORS.WHITE),
        CircleVisual(10, 10, 2, -8, 20, 0, STOCK_COLORS.WHITE),
        armoredBody(0, 255, STOCK_COLORS.WHITE, STOCK_COLORS.CRIMSON, CAPE_2_ARR.LOD0, 0, STOCK_COLORS.GOLD)
    ],

    LOD1: [
        horseVisual(LOD.LOD1, 4, 255, STOCK_COLORS.WHITE),
        CircleVisual(10, 10, 2, -8, 20, 0, STOCK_COLORS.WHITE),
        RectVisual(4, 15, 0, 0, 0, 0, 1, STOCK_COLORS.WHITE),
        RectVisual(9, 16, -4.5, 0, 0, 255, 0, STOCK_COLORS.CRIMSON)
    ],

    LOD2: [
        horseVisual(LOD.LOD2, 4, 255, STOCK_COLORS.WHITE),
        CircleVisual(10, 10, 2, -8, 20, 0, STOCK_COLORS.WHITE),
        RectVisual(4, 15, 0, 0, 0, 0, 1, STOCK_COLORS.WHITE),
        RectVisual(15, 16, -9.5, 0, 0, 255, 1, STOCK_COLORS.CRIMSON)
    ]
};
const DULLAHAN_1_VISUAL = {
    LOD0: [
        horseVisual(LOD.LOD0, 4, 255, STOCK_COLORS.WHITE),
        CircleVisual(10, 10, 2, -8, 20, 0, STOCK_COLORS.WHITE),
        armoredBody(0, 220, STOCK_COLORS.WHITE, STOCK_COLORS.CRIMSON, CAPE_ARR.LOD0, 0, STOCK_COLORS.GOLD)
    ],

    LOD1: [
        horseVisual(LOD.LOD1, 4, 255, STOCK_COLORS.WHITE),
        CircleVisual(10, 10, 2, -8, 20, 0, STOCK_COLORS.WHITE),
        armoredBody(0, 220, STOCK_COLORS.WHITE, STOCK_COLORS.CRIMSON, CAPE_ARR.LOD1, 0, STOCK_COLORS.GOLD)
    ],

    LOD2: [
        horseVisual(LOD.LOD2, 4, 255, STOCK_COLORS.WHITE),
        CircleVisual(10, 10, 2, -8, 20, 0, STOCK_COLORS.WHITE),
        RectVisual(4, 15, 0, 0, 0, 0, 1, STOCK_COLORS.WHITE),
        RectVisual(15, 16, -9.5, 0, 0, 255, 1, STOCK_COLORS.CRIMSON)
    ]
};
const DULLAHAN_2_VISUAL = {
    LOD0: [
        horseVisual(LOD.LOD0, 4, 255, STOCK_COLORS.WHITE),
        CircleVisual(10, 10, 2, -8, 20, 0, STOCK_COLORS.WHITE),
        armoredBody(0, 255, STOCK_COLORS.WHITE, STOCK_COLORS.CRIMSON, CAPE_1_ARR.LOD0, 0, STOCK_COLORS.GOLD)
    ],

    LOD1: [
        horseVisual(LOD.LOD1, 4, 255, STOCK_COLORS.WHITE),
        CircleVisual(10, 10, 2, -8, 20, 0, STOCK_COLORS.WHITE),
        armoredBody(0, 255, STOCK_COLORS.WHITE, STOCK_COLORS.CRIMSON, CAPE_1_ARR.LOD1, 0, STOCK_COLORS.GOLD)
    ],

    LOD2: [
        horseVisual(LOD.LOD2, 4, 255, STOCK_COLORS.WHITE),
        CircleVisual(10, 10, 2, -8, 20, 0, STOCK_COLORS.WHITE),
        RectVisual(4, 15, 0, 0, 0, 0, 1, STOCK_COLORS.WHITE),
        RectVisual(15, 16, -9.5, 0, 0, 255, 1, STOCK_COLORS.CRIMSON)
    ]
};
const DULLAHAN_3_VISUAL = {
    LOD0: [
        horseVisual(LOD.LOD0, 4, 255, STOCK_COLORS.WHITE),
        CircleVisual(10, 10, 2, -8, 20, 0, STOCK_COLORS.WHITE),
        armoredBody(0, 280, STOCK_COLORS.WHITE, STOCK_COLORS.CRIMSON, CAPE_3_ARR.LOD0, 0, STOCK_COLORS.GOLD)
    ],

    LOD1: [
        horseVisual(LOD.LOD1, 4, 255, STOCK_COLORS.WHITE),
        CircleVisual(10, 10, 2, -8, 20, 0, STOCK_COLORS.WHITE),
        armoredBody(0, 280, STOCK_COLORS.WHITE, STOCK_COLORS.CRIMSON, CAPE_3_ARR.LOD1, 0, STOCK_COLORS.GOLD)
    ],

    LOD2: [
        horseVisual(LOD.LOD2, 4, 255, STOCK_COLORS.WHITE),
        CircleVisual(10, 10, 2, -8, 20, 0, STOCK_COLORS.WHITE),
        RectVisual(4, 15, 0, 0, 0, 0, 1, STOCK_COLORS.WHITE),
        RectVisual(15, 16, -9.5, 0, 0, 255, 1, STOCK_COLORS.CRIMSON)
    ]
};

const GUARD_VISUAL = {
    LOD0: [
        RectVisual(4, 15, 0, 0, 0, 170, 1, STOCK_COLORS.WHITE),
        CircleVisual(10, 10, 0, 0, 190, 0, STOCK_COLORS.WHITE),
        ShapeVisual(PLUME_ARR.LOD0, 255, 0)
    ],
    LOD1: [
        RectVisual(4, 15, 0, 0, 0, 170, 1, STOCK_COLORS.WHITE),
        CircleVisual(10, 10, 0, 0, 190, 0, STOCK_COLORS.WHITE),
        ShapeVisual(PLUME_ARR.LOD1, 255, 0)
    ],
    LOD2: [
        RectVisual(4, 15, 0, 0, 0, 170, 1, STOCK_COLORS.WHITE),
        CircleVisual(10, 10, 0, 0, 190, 0, STOCK_COLORS.WHITE),
        PLUME_ARR.LOD2(255)
    ]
};
const GUARD_1_VISUAL = {
    LOD0: [
        RectVisual(4, 15, 0, 0, 0, 170, 1, STOCK_COLORS.WHITE),
        CircleVisual(10, 10, 0, 0, 190, 0, STOCK_COLORS.WHITE),
        ShapeVisual(PLUME_1_ARR.LOD0, 255, 0)
    ],
    LOD1: [
        RectVisual(4, 15, 0, 0, 0, 170, 1, STOCK_COLORS.WHITE),
        CircleVisual(10, 10, 0, 0, 190, 0, STOCK_COLORS.WHITE),
        ShapeVisual(PLUME_1_ARR.LOD1, 255, 0)
    ],
    LOD2: [
        RectVisual(4, 15, 0, 0, 0, 170, 1, STOCK_COLORS.WHITE),
        CircleVisual(10, 10, 0, 0, 190, 0, STOCK_COLORS.WHITE),
        PLUME_1_ARR.LOD2(255)
    ]
};
const GUARD_2_VISUAL = {
    LOD0: [
        RectVisual(4, 15, 0, 0, 0, 170, 1, STOCK_COLORS.WHITE),
        CircleVisual(10, 10, 0, 0, 190, 0, STOCK_COLORS.WHITE),
        ShapeVisual(PLUME_2_ARR.LOD0, 255, 0)
    ],
    LOD1: [
        RectVisual(4, 15, 0, 0, 0, 170, 1, STOCK_COLORS.WHITE),
        CircleVisual(10, 10, 0, 0, 190, 0, STOCK_COLORS.WHITE),
        ShapeVisual(PLUME_2_ARR.LOD1, 255, 0)
    ],
    LOD2: [
        RectVisual(4, 15, 0, 0, 0, 170, 1, STOCK_COLORS.WHITE),
        CircleVisual(10, 10, 0, 0, 190, 0, STOCK_COLORS.WHITE),
        PLUME_2_ARR.LOD2(255)
    ]
};
const GUARD_3_VISUAL = {
    LOD0: [
        RectVisual(4, 15, 0, 0, 0, 170, 1, STOCK_COLORS.WHITE),
        CircleVisual(10, 10, 0, 0, 190, 0, STOCK_COLORS.WHITE),
        ShapeVisual(PLUME_3_ARR.LOD0, 255, 0)
    ],
    LOD1: [
        RectVisual(4, 15, 0, 0, 0, 170, 1, STOCK_COLORS.WHITE),
        CircleVisual(10, 10, 0, 0, 190, 0, STOCK_COLORS.WHITE),
        ShapeVisual(PLUME_3_ARR.LOD1, 255, 0)
    ],
    LOD2: [
        RectVisual(4, 15, 0, 0, 0, 170, 1, STOCK_COLORS.WHITE),
        CircleVisual(10, 10, 0, 0, 190, 0, STOCK_COLORS.WHITE),
        PLUME_3_ARR.LOD2(255)
    ]
};
const GUARD_4_VISUAL = {
    LOD0: [
        RectVisual(4, 15, 0, 0, 0, 170, 1, STOCK_COLORS.WHITE),
        CircleVisual(10, 10, 0, 0, 190, 0, STOCK_COLORS.WHITE),
        ShapeVisual(PLUME_4_ARR.LOD0, 255, 0)
    ],
    LOD1: [
        RectVisual(4, 15, 0, 0, 0, 170, 1, STOCK_COLORS.WHITE),
        CircleVisual(10, 10, 0, 0, 190, 0, STOCK_COLORS.WHITE),
        ShapeVisual(PLUME_4_ARR.LOD1, 255, 0)
    ],
    LOD2: [
        RectVisual(4, 15, 0, 0, 0, 170, 1, STOCK_COLORS.WHITE),
        CircleVisual(10, 10, 0, 0, 190, 0, STOCK_COLORS.WHITE),
        PLUME_4_ARR.LOD2(255)
    ]
};
const GUARD_5_VISUAL = {
    LOD0: [
        RectVisual(4, 15, 0, 0, 0, 170, 1, STOCK_COLORS.WHITE),
        CircleVisual(10, 10, 0, 0, 190, 0, STOCK_COLORS.WHITE),
        ShapeVisual(PLUME_5_ARR.LOD0, 255, 0)
    ],
    LOD1: [
        RectVisual(4, 15, 0, 0, 0, 170, 1, STOCK_COLORS.WHITE),
        CircleVisual(10, 10, 0, 0, 190, 0, STOCK_COLORS.WHITE),
        ShapeVisual(PLUME_5_ARR.LOD1, 255, 0)
    ],
    LOD2: [
        RectVisual(4, 15, 0, 0, 0, 170, 1, STOCK_COLORS.WHITE),
        CircleVisual(10, 10, 0, 0, 190, 0, STOCK_COLORS.WHITE),
        PLUME_5_ARR.LOD2(255)
    ]
};
const GUARD_6_VISUAL = {
    LOD0: [
        RectVisual(4, 15, 0, 0, 0, 170, 1, STOCK_COLORS.WHITE),
        CircleVisual(10, 10, 0, 0, 190, 0, STOCK_COLORS.WHITE),
        ShapeVisual(PLUME_6_ARR.LOD0, 255, 0)
    ],
    LOD1: [
        RectVisual(4, 15, 0, 0, 0, 170, 1, STOCK_COLORS.WHITE),
        CircleVisual(10, 10, 0, 0, 190, 0, STOCK_COLORS.WHITE),
        ShapeVisual(PLUME_6_ARR.LOD1, 255, 0)
    ],
    LOD2: [
        RectVisual(4, 15, 0, 0, 0, 170, 1, STOCK_COLORS.WHITE),
        CircleVisual(10, 10, 0, 0, 190, 0, STOCK_COLORS.WHITE),
        PLUME_6_ARR.LOD2(255)
    ]
};
const GUARD_7_VISUAL = {
    LOD0: [
        RectVisual(4, 15, 0, 0, 0, 170, 1, STOCK_COLORS.WHITE),
        CircleVisual(10, 10, 0, 0, 190, 0, STOCK_COLORS.WHITE),
        ShapeVisual(PLUME_7_ARR.LOD0, 255, 0)
    ],
    LOD1: [
        RectVisual(4, 15, 0, 0, 0, 170, 1, STOCK_COLORS.WHITE),
        CircleVisual(10, 10, 0, 0, 190, 0, STOCK_COLORS.WHITE),
        ShapeVisual(PLUME_7_ARR.LOD1, 255, 0)
    ],
    LOD2: [
        RectVisual(4, 15, 0, 0, 0, 170, 1, STOCK_COLORS.WHITE),
        CircleVisual(10, 10, 0, 0, 190, 0, STOCK_COLORS.WHITE),
        PLUME_7_ARR.LOD2(255)
    ]
};
const GUARD_8_VISUAL = {
    LOD0: [
        RectVisual(4, 15, 0, 0, 0, 170, 1, STOCK_COLORS.WHITE),
        CircleVisual(10, 10, 0, 0, 190, 0, STOCK_COLORS.WHITE),
        ShapeVisual(PLUME_8_ARR.LOD0, 255, 0)
    ],
    LOD1: [
        RectVisual(4, 15, 0, 0, 0, 170, 1, STOCK_COLORS.WHITE),
        CircleVisual(10, 10, 0, 0, 190, 0, STOCK_COLORS.WHITE),
        ShapeVisual(PLUME_8_ARR.LOD1, 255, 0)
    ],
    LOD2: [
        RectVisual(4, 15, 0, 0, 0, 170, 1, STOCK_COLORS.WHITE),
        CircleVisual(10, 10, 0, 0, 190, 0, STOCK_COLORS.WHITE),
        PLUME_8_ARR.LOD2(255)
    ]
};
const GUARD_9_VISUAL = {
    LOD0: [
        RectVisual(4, 15, 0, 0, 0, 170, 1, STOCK_COLORS.WHITE),
        CircleVisual(10, 10, 0, 0, 190, 0, STOCK_COLORS.WHITE),
        ShapeVisual(PLUME_9_ARR.LOD0, 255, 0)
    ],
    LOD1: [
        RectVisual(4, 15, 0, 0, 0, 170, 1, STOCK_COLORS.WHITE),
        CircleVisual(10, 10, 0, 0, 190, 0, STOCK_COLORS.WHITE),
        ShapeVisual(PLUME_9_ARR.LOD1, 255, 0)
    ],
    LOD2: [
        RectVisual(4, 15, 0, 0, 0, 170, 1, STOCK_COLORS.WHITE),
        CircleVisual(10, 10, 0, 0, 190, 0, STOCK_COLORS.WHITE),
        PLUME_9_ARR.LOD2(255)
    ]
};

const SHIELDED_VISUAL = {
    LOD0: [
        new Visual(function (x, y, cols, timeElapsed) {
            push();
            translate(x, y);
            rectMode(CENTER);
            strokeWeight(1);
            fill(...STOCK_COLORS.ROYALBLUE)
            stroke(...STOCK_COLORS.ROYALBLUE)
            rect(0, 0, 4, 15);
            stroke(...STOCK_COLORS.GOLD);
            fill(...STOCK_COLORS.LEATHER);
            translate(6, -5);
            rotate(-Math.PI / 9)
            strokeWeight(0)
            arc(0, 0, 4, 10, HALF_PI + PI, HALF_PI);
            strokeWeight(0.5);
            arc(0, 0, 1.5, 10, HALF_PI, HALF_PI + PI);
            fill(190);
            strokeWeight(0);
            arc(3.5, 0, 4, 5, PI - QUARTER_PI, PI + QUARTER_PI);
            pop();
        }, 255),
        morionVisual(170)
    ],
    LOD1: [
        new Visual(function (x, y, cols, timeElapsed) {
            push();
            translate(x, y);
            rectMode(CENTER);
            strokeWeight(1);
            fill(...STOCK_COLORS.ROYALBLUE)
            stroke(...STOCK_COLORS.ROYALBLUE)
            rect(0, 0, 4, 15);
            fill(...STOCK_COLORS.LEATHER);
            translate(6, -5);
            rotate(-Math.PI / 9)
            strokeWeight(0)
            arc(0, 0, 4, 10, HALF_PI + PI, HALF_PI);
            fill(190);
            arc(3.5, 0, 4, 5, PI - QUARTER_PI, PI + QUARTER_PI);
            pop();
        }, 255),
        morionVisual(170)
    ],
    LOD2: [
        new Visual(function (x, y, cols, timeElapsed) {
            push();
            translate(x, y);
            rectMode(CENTER);
            strokeWeight(1);
            fill(...STOCK_COLORS.ROYALBLUE)
            stroke(...STOCK_COLORS.ROYALBLUE)
            rect(0, 0, 4, 15);
            fill(...STOCK_COLORS.LEATHER);
            translate(6, -5);
            rotate(-Math.PI / 9)
            strokeWeight(0)
            arc(0, 0, 4, 10, HALF_PI + PI, HALF_PI);
            pop();
        }, 255),
        CircleVisual(12, 6, 0, 0, 170, 0, STOCK_COLORS.WHITE)
    ]
};
const SHIELDED_1_VISUAL = {
    LOD0: [
        new Visual(function (x, y, cols, timeElapsed) {
            push();
            translate(x, y);
            rectMode(CENTER);
            strokeWeight(1);
            fill(...STOCK_COLORS.SCARLET)
            stroke(...STOCK_COLORS.SCARLET)
            rect(0, 0, 4, 15);
            stroke(...STOCK_COLORS.GOLD);
            fill(...STOCK_COLORS.LEATHER);
            translate(6, -5);
            rotate(-Math.PI / 9)
            strokeWeight(0)
            arc(0, 0, 4, 10, HALF_PI + PI, HALF_PI);
            strokeWeight(0.5);
            arc(0, 0, 1.5, 10, HALF_PI, HALF_PI + PI);
            fill(190);
            strokeWeight(0);
            arc(3.5, 0, 4, 5, PI - QUARTER_PI, PI + QUARTER_PI);
            pop();
        }, 255),
        morionVisual(170)
    ],
    LOD1: [
        new Visual(function (x, y, cols, timeElapsed) {
            push();
            translate(x, y);
            rectMode(CENTER);
            strokeWeight(1);
            fill(...STOCK_COLORS.SCARLET)
            stroke(...STOCK_COLORS.SCARLET)
            rect(0, 0, 4, 15);
            fill(...STOCK_COLORS.LEATHER);
            translate(6, -5);
            rotate(-Math.PI / 9)
            strokeWeight(0)
            arc(0, 0, 4, 10, HALF_PI + PI, HALF_PI);
            fill(190);
            arc(3.5, 0, 4, 5, PI - QUARTER_PI, PI + QUARTER_PI);
            pop();
        }, 255),
        morionVisual(170)
    ],
    LOD2: [
        new Visual(function (x, y, cols, timeElapsed) {
            push();
            translate(x, y);
            rectMode(CENTER);
            strokeWeight(1);
            fill(...STOCK_COLORS.SCARLET)
            stroke(...STOCK_COLORS.SCARLET)
            rect(0, 0, 4, 15);
            fill(...STOCK_COLORS.LEATHER);
            translate(6, -5);
            rotate(-Math.PI / 9)
            strokeWeight(0)
            arc(0, 0, 4, 10, HALF_PI + PI, HALF_PI);
            pop();
        }, 255),
        CircleVisual(12, 6, 0, 0, 170, 0, STOCK_COLORS.WHITE)
    ]
};
const SHIELDED_2_VISUAL = {
    LOD0: [
        new Visual(function (x, y, cols, timeElapsed) {
            push();
            translate(x, y);
            rectMode(CENTER);
            strokeWeight(1);
            fill(...STOCK_COLORS.EMERALD)
            stroke(...STOCK_COLORS.EMERALD)
            rect(0, 0, 4, 15);
            stroke(...STOCK_COLORS.GOLD);
            fill(...STOCK_COLORS.LEATHER);
            translate(6, -5);
            rotate(-Math.PI / 9)
            strokeWeight(0)
            arc(0, 0, 4, 10, HALF_PI + PI, HALF_PI);
            strokeWeight(0.5);
            arc(0, 0, 1.5, 10, HALF_PI, HALF_PI + PI);
            fill(190);
            strokeWeight(0);
            arc(3.5, 0, 4, 5, PI - QUARTER_PI, PI + QUARTER_PI);
            pop();
        }, 255),
        morionVisual(170)
    ],
    LOD1: [
        new Visual(function (x, y, cols, timeElapsed) {
            push();
            translate(x, y);
            rectMode(CENTER);
            strokeWeight(1);
            fill(...STOCK_COLORS.EMERALD)
            stroke(...STOCK_COLORS.EMERALD)
            rect(0, 0, 4, 15);
            fill(...STOCK_COLORS.LEATHER);
            translate(6, -5);
            rotate(-Math.PI / 9)
            strokeWeight(0)
            arc(0, 0, 4, 10, HALF_PI + PI, HALF_PI);
            fill(190);
            arc(3.5, 0, 4, 5, PI - QUARTER_PI, PI + QUARTER_PI);
            pop();
        }, 255),
        morionVisual(170)
    ],
    LOD2: [
        new Visual(function (x, y, cols, timeElapsed) {
            push();
            translate(x, y);
            rectMode(CENTER);
            strokeWeight(1);
            fill(...STOCK_COLORS.EMERALD)
            stroke(...STOCK_COLORS.EMERALD)
            rect(0, 0, 4, 15);
            fill(...STOCK_COLORS.LEATHER);
            translate(6, -5);
            rotate(-Math.PI / 9)
            strokeWeight(0)
            arc(0, 0, 4, 10, HALF_PI + PI, HALF_PI);
            pop();
        }, 255),
        CircleVisual(12, 6, 0, 0, 170, 0, STOCK_COLORS.WHITE)
    ]
};
const SHIELDED_3_VISUAL = {
    LOD0: [
        new Visual(function (x, y, cols, timeElapsed) {
            push();
            translate(x, y);
            rectMode(CENTER);
            strokeWeight(1);
            fill(...STOCK_COLORS.PURPLE)
            stroke(...STOCK_COLORS.PURPLE)
            rect(0, 0, 4, 15);
            stroke(...STOCK_COLORS.GOLD);
            fill(...STOCK_COLORS.LEATHER);
            translate(6, -5);
            rotate(-Math.PI / 9)
            strokeWeight(0)
            arc(0, 0, 4, 10, HALF_PI + PI, HALF_PI);
            strokeWeight(0.5);
            arc(0, 0, 1.5, 10, HALF_PI, HALF_PI + PI);
            fill(190);
            strokeWeight(0);
            arc(3.5, 0, 4, 5, PI - QUARTER_PI, PI + QUARTER_PI);
            pop();
        }, 255),
        morionVisual(170)
    ],
    LOD1: [
        new Visual(function (x, y, cols, timeElapsed) {
            push();
            translate(x, y);
            rectMode(CENTER);
            strokeWeight(1);
            fill(...STOCK_COLORS.PURPLE)
            stroke(...STOCK_COLORS.PURPLE)
            rect(0, 0, 4, 15);
            fill(...STOCK_COLORS.LEATHER);
            translate(6, -5);
            rotate(-Math.PI / 9)
            strokeWeight(0)
            arc(0, 0, 4, 10, HALF_PI + PI, HALF_PI);
            fill(190);
            arc(3.5, 0, 4, 5, PI - QUARTER_PI, PI + QUARTER_PI);
            pop();
        }, 255),
        morionVisual(170)
    ],
    LOD2: [
        new Visual(function (x, y, cols, timeElapsed) {
            push();
            translate(x, y);
            rectMode(CENTER);
            strokeWeight(1);
            fill(...STOCK_COLORS.PURPLE)
            stroke(...STOCK_COLORS.PURPLE)
            rect(0, 0, 4, 15);
            fill(...STOCK_COLORS.LEATHER);
            translate(6, -5);
            rotate(-Math.PI / 9)
            strokeWeight(0)
            arc(0, 0, 4, 10, HALF_PI + PI, HALF_PI);
            pop();
        }, 255),
        CircleVisual(12, 6, 0, 0, 170, 0, STOCK_COLORS.WHITE)
    ]
};
const SHIELDED_4_VISUAL = {
    LOD0: [
        new Visual(function (x, y, cols, timeElapsed) {
            push();
            translate(x, y);
            rectMode(CENTER);
            strokeWeight(1);
            fill(...STOCK_COLORS.MAGENTA)
            stroke(...STOCK_COLORS.MAGENTA)
            rect(0, 0, 4, 15);
            stroke(...STOCK_COLORS.GOLD);
            fill(...STOCK_COLORS.LEATHER);
            translate(6, -5);
            rotate(-Math.PI / 9)
            strokeWeight(0)
            arc(0, 0, 4, 10, HALF_PI + PI, HALF_PI);
            strokeWeight(0.5);
            arc(0, 0, 1.5, 10, HALF_PI, HALF_PI + PI);
            fill(190);
            strokeWeight(0);
            arc(3.5, 0, 4, 5, PI - QUARTER_PI, PI + QUARTER_PI);
            pop();
        }, 255),
        morionVisual(170)
    ],
    LOD1: [
        new Visual(function (x, y, cols, timeElapsed) {
            push();
            translate(x, y);
            rectMode(CENTER);
            strokeWeight(1);
            fill(...STOCK_COLORS.MAGENTA)
            stroke(...STOCK_COLORS.MAGENTA)
            rect(0, 0, 4, 15);
            fill(...STOCK_COLORS.LEATHER);
            translate(6, -5);
            rotate(-Math.PI / 9)
            strokeWeight(0)
            arc(0, 0, 4, 10, HALF_PI + PI, HALF_PI);
            fill(190);
            arc(3.5, 0, 4, 5, PI - QUARTER_PI, PI + QUARTER_PI);
            pop();
        }, 255),
        morionVisual(170)
    ],
    LOD2: [
        new Visual(function (x, y, cols, timeElapsed) {
            push();
            translate(x, y);
            rectMode(CENTER);
            strokeWeight(1);
            fill(...STOCK_COLORS.MAGENTA)
            stroke(...STOCK_COLORS.MAGENTA)
            rect(0, 0, 4, 15);
            fill(...STOCK_COLORS.LEATHER);
            translate(6, -5);
            rotate(-Math.PI / 9)
            strokeWeight(0)
            arc(0, 0, 4, 10, HALF_PI + PI, HALF_PI);
            pop();
        }, 255),
        CircleVisual(12, 6, 0, 0, 170, 0, STOCK_COLORS.WHITE)
    ]
};
const SHIELDED_5_VISUAL = {
    LOD0: [
        new Visual(function (x, y, cols, timeElapsed) {
            push();
            translate(x, y);
            rectMode(CENTER);
            strokeWeight(1);
            fill(...STOCK_COLORS.TEAL)
            stroke(...STOCK_COLORS.TEAL)
            rect(0, 0, 4, 15);
            stroke(...STOCK_COLORS.GOLD);
            fill(...STOCK_COLORS.LEATHER);
            translate(6, -5);
            rotate(-Math.PI / 9)
            strokeWeight(0)
            arc(0, 0, 4, 10, HALF_PI + PI, HALF_PI);
            strokeWeight(0.5);
            arc(0, 0, 1.5, 10, HALF_PI, HALF_PI + PI);
            fill(190);
            strokeWeight(0);
            arc(3.5, 0, 4, 5, PI - QUARTER_PI, PI + QUARTER_PI);
            pop();
        }, 255),
        morionVisual(170)
    ],
    LOD1: [
        new Visual(function (x, y, cols, timeElapsed) {
            push();
            translate(x, y);
            rectMode(CENTER);
            strokeWeight(1);
            fill(...STOCK_COLORS.TEAL)
            stroke(...STOCK_COLORS.TEAL)
            rect(0, 0, 4, 15);
            fill(...STOCK_COLORS.LEATHER);
            translate(6, -5);
            rotate(-Math.PI / 9)
            strokeWeight(0)
            arc(0, 0, 4, 10, HALF_PI + PI, HALF_PI);
            fill(190);
            arc(3.5, 0, 4, 5, PI - QUARTER_PI, PI + QUARTER_PI);
            pop();
        }, 255),
        morionVisual(170)
    ],
    LOD2: [
        new Visual(function (x, y, cols, timeElapsed) {
            push();
            translate(x, y);
            rectMode(CENTER);
            strokeWeight(1);
            fill(...STOCK_COLORS.TEAL)
            stroke(...STOCK_COLORS.TEAL)
            rect(0, 0, 4, 15);
            fill(...STOCK_COLORS.LEATHER);
            translate(6, -5);
            rotate(-Math.PI / 9)
            strokeWeight(0)
            arc(0, 0, 4, 10, HALF_PI + PI, HALF_PI);
            pop();
        }, 255),
        CircleVisual(12, 6, 0, 0, 170, 0, STOCK_COLORS.WHITE)
    ]
};

const ARMORED_VISUAL = {
    LOD0: [
        RectVisual(4, 15, 0, 0, 0, 255, 1, STOCK_COLORS.TEAL),
        morionVisual(170),
        ShapeVisual([
            { x: -3, y: 0, curve: false },
            { x: -5, y: -2, curve: true },
            { x: -6, y: -5, curve: true },
            { x: -5, y: -8, curve: false },
            { x: -3, y: -6, curve: true },
            { x: -2, y: -3, curve: true },
            { x: -3, y: 0, curve: false }
        ], 300, 0)
    ],
    LOD1: [
        RectVisual(4, 15, 0, 0, 0, 255, 1, STOCK_COLORS.TEAL),
        CircleVisual(12, 6, 0, 0, 170, 0, STOCK_COLORS.WHITE),
        ShapeVisual([
            { x: -3, y: 0, curve: false },
            { x: -6, y: -4, curve: true },
            { x: -5, y: -8, curve: false },
            { x: -2, y: -3, curve: true },
            { x: -3, y: 0, curve: false }
        ], 300, 0)
    ],
    LOD2: [
        RectVisual(4, 15, 0, 0, 0, 255, 1, STOCK_COLORS.TEAL),
        CircleVisual(12, 6, 0, 0, 170, 0, STOCK_COLORS.WHITE)
    ]
};

const ARMORED_1_VISUAL = {
    LOD0: [
        RectVisual(4, 15, 0, 0, 0, 255, 1, STOCK_COLORS.SCARLET),
        morionVisual(170),
        ShapeVisual([
            { x: -3, y: 0, curve: false },
            { x: -5, y: 3, curve: true },
            { x: -5, y: 6, curve: false },
            { x: -3, y: 8, curve: false },
            { x: -2, y: 5, curve: true },
            { x: 0, y: 3, curve: true },
            { x: -3, y: 0, curve: false }
        ], 255, 0)
    ],
    LOD1: [
        RectVisual(4, 15, 0, 0, 0, 255, 1, STOCK_COLORS.SCARLET),
        CircleVisual(12, 6, 0, 0, 170, 0, STOCK_COLORS.WHITE),
        ShapeVisual([
            { x: -3, y: 0, curve: false },
            { x: -5, y: 5, curve: true },
            { x: -3, y: 8, curve: false },
            { x: 0, y: 3, curve: true },
            { x: -3, y: 0, curve: false }
        ], 255, 0)
    ],
    LOD2: [
        RectVisual(4, 15, 0, 0, 0, 255, 1, STOCK_COLORS.SCARLET),
        CircleVisual(12, 6, 0, 0, 170, 0, STOCK_COLORS.WHITE)
    ]
};

const ARMORED_2_VISUAL = {
    LOD0: [
        RectVisual(4, 15, 0, 0, 0, 255, 1, STOCK_COLORS.ROYALBLUE),
        morionVisual(170),
        ShapeVisual([
            { x: 3, y: 0, curve: false },
            { x: 2, y: -3, curve: true },
            { x: 4, y: -6, curve: true },
            { x: 7, y: -8, curve: false },
            { x: 6, y: -4, curve: true },
            { x: 4, y: -1, curve: true },
            { x: 3, y: 0, curve: false }
        ], 220, 0)
    ],
    LOD1: [
        RectVisual(4, 15, 0, 0, 0, 255, 1, STOCK_COLORS.ROYALBLUE),
        CircleVisual(12, 6, 0, 0, 170, 0, STOCK_COLORS.WHITE),
        ShapeVisual([
            { x: 3, y: 0, curve: false },
            { x: 4, y: -5, curve: true },
            { x: 7, y: -8, curve: false },
            { x: 4, y: -1, curve: true },
            { x: 3, y: 0, curve: false }
        ], 220, 0)
    ],
    LOD2: [
        RectVisual(4, 15, 0, 0, 0, 255, 1, STOCK_COLORS.ROYALBLUE),
        CircleVisual(12, 6, 0, 0, 170, 0, STOCK_COLORS.WHITE)
    ]
};

const ARMORED_3_VISUAL = {
    LOD0: [
        RectVisual(4, 15, 0, 0, 0, 255, 1, STOCK_COLORS.MAGENTA),
        morionVisual(150),
        ShapeVisual([
            { x: 0, y: 0, curve: false },
            { x: -2, y: -2, curve: true },
            { x: -5, y: -3, curve: true },
            { x: -7, y: -6, curve: false },
            { x: -3, y: -5, curve: true },
            { x: 0, y: -3, curve: true },
            { x: 0, y: 0, curve: false }
        ], 255, 0)
    ],
    LOD1: [
        RectVisual(4, 15, 0, 0, 0, 255, 1, STOCK_COLORS.MAGENTA),
        CircleVisual(12, 6, 0, 0, 150, 0, STOCK_COLORS.WHITE),
        ShapeVisual([
            { x: 0, y: 0, curve: false },
            { x: -4, y: -3, curve: true },
            { x: -7, y: -6, curve: false },
            { x: 0, y: -3, curve: true },
            { x: 0, y: 0, curve: false }
        ], 255, 0)
    ],
    LOD2: [
        RectVisual(4, 15, 0, 0, 0, 255, 1, STOCK_COLORS.MAGENTA),
        CircleVisual(12, 6, 0, 0, 150, 0, STOCK_COLORS.WHITE)
    ]
};

const ARMORED_4_VISUAL = {
    LOD0: [
        RectVisual(4, 15, 0, 0, 0, 255, 1, STOCK_COLORS.EMERALD),
        morionVisual(160),
        ShapeVisual([
            { x: 0, y: 0, curve: false },
            { x: -2, y: 2, curve: true },
            { x: -3, y: 5, curve: true },
            { x: -2, y: 8, curve: false },
            { x: 0, y: 6, curve: true },
            { x: 1, y: 3, curve: true },
            { x: 0, y: 0, curve: false }
        ], 270, 0)
    ],
    LOD1: [
        RectVisual(4, 15, 0, 0, 0, 255, 1, STOCK_COLORS.EMERALD),
        CircleVisual(12, 6, 0, 0, 160, 0, STOCK_COLORS.WHITE),
        ShapeVisual([
            { x: 0, y: 0, curve: false },
            { x: -3, y: 4, curve: true },
            { x: -2, y: 8, curve: false },
            { x: 1, y: 3, curve: true },
            { x: 0, y: 0, curve: false }
        ], 270, 0)
    ],
    LOD2: [
        RectVisual(4, 15, 0, 0, 0, 255, 1, STOCK_COLORS.EMERALD),
        CircleVisual(12, 6, 0, 0, 160, 0, STOCK_COLORS.WHITE)
    ]
};

const ARMORED_5_VISUAL = {
    LOD0: [
        RectVisual(4, 15, 0, 0, 0, 210, 1),
        morionVisual(170),
        ShapeVisual([
            { x: -4, y: 0, curve: false },
            { x: -7, y: -2, curve: true },
            { x: -9, y: -5, curve: true },
            { x: -9, y: -8, curve: false },
            { x: -6, y: -6, curve: true },
            { x: -3, y: -3, curve: true },
            { x: -4, y: 0, curve: false }
        ], 280, 0)
    ],
    LOD1: [
        RectVisual(4, 15, 0, 0, 0, 210, 1),
        CircleVisual(12, 6, 0, 0, 170, 0, STOCK_COLORS.WHITE),
        ShapeVisual([
            { x: -4, y: 0, curve: false },
            { x: -8, y: -4, curve: true },
            { x: -9, y: -8, curve: false },
            { x: -3, y: -3, curve: true },
            { x: -4, y: 0, curve: false }
        ], 280, 0)
    ],
    LOD2: [
        RectVisual(4, 15, 0, 0, 0, 210, 1),
        CircleVisual(12, 6, 0, 0, 170, 0, STOCK_COLORS.WHITE)
    ]
};

const ARMORED_6_VISUAL = {
    LOD0: [
        RectVisual(4, 15, 0, 0, 0, 255, 1, STOCK_COLORS.TEAL),
        morionVisual(170)
    ],
    LOD1: [
        RectVisual(4, 15, 0, 0, 0, 255, 1, STOCK_COLORS.TEAL),
        CircleVisual(12, 6, 0, 0, 170, 0, STOCK_COLORS.WHITE)
    ],
    LOD2: [
        RectVisual(4, 15, 0, 0, 0, 255, 1, STOCK_COLORS.TEAL),
        CircleVisual(12, 6, 0, 0, 170, 0, STOCK_COLORS.WHITE)
    ]
};

const ARMORED_7_VISUAL = {
    LOD0: [
        RectVisual(4, 15, 0, 0, 0, 255, 1, STOCK_COLORS.SCARLET),
        morionVisual(170)
    ],
    LOD1: [
        RectVisual(4, 15, 0, 0, 0, 255, 1, STOCK_COLORS.SCARLET),
        CircleVisual(12, 6, 0, 0, 170, 0, STOCK_COLORS.WHITE)
    ],
    LOD2: [
        RectVisual(4, 15, 0, 0, 0, 255, 1, STOCK_COLORS.SCARLET),
        CircleVisual(12, 6, 0, 0, 170, 0, STOCK_COLORS.WHITE)
    ]
};

const ARMORED_8_VISUAL = {
    LOD0: [
        RectVisual(4, 15, 0, 0, 0, 255, 1, STOCK_COLORS.ROYALBLUE),
        morionVisual(170)
    ],
    LOD1: [
        RectVisual(4, 15, 0, 0, 0, 255, 1, STOCK_COLORS.ROYALBLUE),
        CircleVisual(12, 6, 0, 0, 170, 0, STOCK_COLORS.WHITE)
    ],
    LOD2: [
        RectVisual(4, 15, 0, 0, 0, 255, 1, STOCK_COLORS.ROYALBLUE),
        CircleVisual(12, 6, 0, 0, 170, 0, STOCK_COLORS.WHITE),
        RectVisual(3, 2, 4, -3, 0, 220, 0)
    ]
};

const ARMORED_9_VISUAL = {
    LOD0: [
        RectVisual(4, 15, 0, 0, 0, 255, 1, STOCK_COLORS.MAGENTA),
        morionVisual(150)
    ],
    LOD1: [
        RectVisual(4, 15, 0, 0, 0, 255, 1, STOCK_COLORS.MAGENTA),
        CircleVisual(12, 6, 0, 0, 150, 0, STOCK_COLORS.WHITE)
    ],
    LOD2: [
        RectVisual(4, 15, 0, 0, 0, 255, 1, STOCK_COLORS.MAGENTA),
        CircleVisual(12, 6, 0, 0, 150, 0, STOCK_COLORS.WHITE)
    ]
};

const ARMORED_10_VISUAL = {
    LOD0: [
        RectVisual(4, 15, 0, 0, 0, 255, 1, STOCK_COLORS.EMERALD),
        morionVisual(160)
    ],
    LOD1: [
        RectVisual(4, 15, 0, 0, 0, 255, 1, STOCK_COLORS.EMERALD),
        CircleVisual(12, 6, 0, 0, 160, 0, STOCK_COLORS.WHITE)
    ],
    LOD2: [
        RectVisual(4, 15, 0, 0, 0, 255, 1, STOCK_COLORS.EMERALD),
        CircleVisual(12, 6, 0, 0, 160, 0, STOCK_COLORS.WHITE)
    ]
};
const ARMORED_11_VISUAL = {
    LOD0: [
        RectVisual(4, 15, 0, 0, 0, 210, 1),
        morionVisual(170)
    ],
    LOD1: [
        RectVisual(4, 15, 0, 0, 0, 210, 1),
        CircleVisual(12, 6, 0, 0, 170, 0, STOCK_COLORS.WHITE)
    ],
    LOD2: [
        RectVisual(4, 15, 0, 0, 0, 210, 1),
        CircleVisual(12, 6, 0, 0, 170, 0, STOCK_COLORS.WHITE)
    ]
};

const ARCHER_VISUAL = {
    LOD0: [
        RectVisual(9, 2.5, -1.5, 7, Math.PI / 6, 255, 0, STOCK_COLORS.WOOD),
        RectVisual(4, 15, 0, 0, 0, 170, 1, STOCK_COLORS.WHITE),
        CircleVisual(10, 10, 0, 0, 190, 0, STOCK_COLORS.WHITE)
    ],
    LOD1: [
        RectVisual(9, 2.5, -1.5, 7, Math.PI / 6, 255, 0, STOCK_COLORS.WOOD),
        RectVisual(4, 15, 0, 0, 0, 170, 1, STOCK_COLORS.WHITE),
        CircleVisual(10, 10, 0, 0, 190, 0, STOCK_COLORS.WHITE)
    ],
    LOD2: [
        RectVisual(4, 15, 0, 0, 0, 170, 1, STOCK_COLORS.WHITE),
        CircleVisual(10, 10, 0, 0, 190, 0, STOCK_COLORS.WHITE)
    ]
};

const ANGEL_WING_UP = [
    // Inner wing root
    { x: 11, y: -2, curve: true },

    // Smooth upper contour
    { x: 11.75, y: -41, curve: true },
    { x: 8, y: -62, curve: true },
    { x: 5, y: -71, curve: true },
    { x: 5, y: -71, curve: false },
    { x: 5, y: -71, curve: true },

    // Long outer flight feathers
    { x: 2, y: -50, curve: true },
    { x: 2, y: -29, curve: true },
    { x: 6.5, y: -17, curve: true },
    { x: 9.5, y: -2, curve: true },
];

const ANGEL_WING_UP_1 = [
    { x: 10.38, y: -1.54, curve: true },
    { x: -2.325, y: -38.86, curve: true },
    { x: -12.72, y: -56.41, curve: true },
    { x: -19.035, y: -64.75, curve: true },
    { x: -19.035, y: -64.75, curve: false },
    { x: -19.035, y: -64.75, curve: true },
    { x: -15.045, y: -43.095, curve: true },
    { x: -7.05, y: -22.89, curve: true },
    { x: 1.32, y: -14.755, curve: true },
    { x: 8.97, y: -2.05, curve: true }
];

const ANGEL_WING_UP_2 = [
    { x: 9.95, y: -0.94, curve: true },
    { x: -14.5, y: -32.155, curve: true },
    { x: -31.555, y: -43.57, curve: true },
    { x: -38.65, y: -49.6, curve: true },
    { x: -38.65, y: -49.6, curve: false },
    { x: -38.65, y: -49.6, curve: true },
    { x: -28.495, y: -30.295, curve: true },
    { x: -15.725, y: -14.275, curve: true },
    { x: -3.625, y: -9.64, curve: true },
    { x: 9.95, y: -0.94, curve: true }
];

const ANGEL_WING_DOWN = ANGEL_WING_UP.map(
    pt => ({ ...pt, y: -pt.y })
);

const ANGEL_WING_DOWN_1 = ANGEL_WING_UP_1.map(
    pt => ({ ...pt, y: -pt.y })
);

const ANGEL_WING_DOWN_2 = ANGEL_WING_UP_2.map(
    pt => ({ ...pt, y: -pt.y })
);

const ANGEL_MOVING_VISUAL = {
    LOD0: [
        new Visual(function (x, y, cols, timeElapsed = 0.625) {
            push();
            translate(x + 2, y);
            strokeJoin(ROUND);
            strokeWeight(0);

            const drawWing = (pts, alpha) => {
                fill(255, 255, 255, alpha);
                beginShape();
                for (const pt of pts) {
                    if (pt.curve) {
                        splineVertex(pt.x, pt.y);
                    } else {
                        vertex(pt.x, pt.y);
                    }
                }
                endShape(CLOSE);
            };
            const lifeCycle = timeElapsed % 2.5;
            const amt = Math.abs(lifeCycle - 1.25);
            const angle = amt / 1.25 * 2 * Math.PI / 5 - Math.PI / 4;
            translate(amt / 1.25 * 5, 0);
            push();
            rotate(-angle);
            drawWing(ANGEL_WING_UP_2, 200);
            rotate(-Math.PI / 6);
            drawWing(ANGEL_WING_UP_1, 200);
            rotate(-Math.PI / 7);
            drawWing(ANGEL_WING_UP, 240);
            pop();
            push();
            rotate(angle);
            drawWing(ANGEL_WING_DOWN_2, 200);
            rotate(Math.PI / 6);
            drawWing(ANGEL_WING_DOWN_1, 200);
            rotate(Math.PI / 7);
            drawWing(ANGEL_WING_DOWN, 240);
            pop();
            pop();
        }, 255),
        // Armored body
        armoredBody(
            180,
            255,
            STOCK_COLORS.GOLD,
            STOCK_COLORS.GOLD,
            [], 12
        ),
        // Head
        CircleVisual(9, 9, 12, 0, 255, 0, STOCK_COLORS.WHITE),
        // Halo
        CircleOutlineVisual(12, 12, 1, 12, 0, 255, STOCK_COLORS.HALO)
    ],
    LOD1: [
        new Visual(function (x, y, cols, timeElapsed = 0) {
            push();
            translate(x + 2, y);
            strokeJoin(ROUND);
            strokeWeight(0);

            const drawWing = (pts, alpha) => {
                fill(255, 255, 255, alpha);
                beginShape();
                for (const pt of pts) {
                    if (pt.curve) {
                        splineVertex(pt.x, pt.y);
                    } else {
                        vertex(pt.x, pt.y);
                    }
                }
                endShape(CLOSE);
            };
            const lifeCycle = timeElapsed % 2.5;
            const amt = Math.abs(lifeCycle - 1.25);
            const angle = amt / 1.25 * 2 * Math.PI / 5 - Math.PI / 4;
            translate(amt / 1.25 * 5, 0);
            push();
            rotate(-angle);
            drawWing(ANGEL_WING_UP_2, 200);
            rotate(-Math.PI / 6);
            drawWing(ANGEL_WING_UP_1, 200);
            rotate(-Math.PI / 7);
            drawWing(ANGEL_WING_UP, 240);
            pop();
            push();
            rotate(angle);
            drawWing(ANGEL_WING_DOWN_2, 200);
            rotate(Math.PI / 6);
            drawWing(ANGEL_WING_DOWN_1, 200);
            rotate(Math.PI / 7);
            drawWing(ANGEL_WING_DOWN, 240);
            pop();
            pop();
        }, 255),
        armoredBody(235, 230, STOCK_COLORS.GOLD, STOCK_COLORS.GOLD, [], 12),
        CircleVisual(9, 9, 12, 0, 255, 0, STOCK_COLORS.WHITE),
        CircleOutlineVisual(12, 12, 1, 12, 0, 255, STOCK_COLORS.HALO)
    ],
    LOD2: [
        // Broad wing silhouette
        new Visual(function (x, y, cols, timeElapsed = 1) {
            push();
            translate(x, y);
            const lifeCycle = timeElapsed % 2.5;
            const amt = Math.abs(lifeCycle - 1.25);
            const angle = amt / 1.25 * 2 * Math.PI / 5 - Math.PI / 4;
            strokeWeight(0);
            push();
            rotate(-angle);
            fill(255, 255, 255, 200);
            triangle(11, 0, -22, -33, -6, -7);
            rotate(-Math.PI / 6);
            triangle(11, 0, -9, -44, -4, -16);
            rotate(-Math.PI / 7);
            fill(255, 255, 255, 240);
            triangle(11, 0, 4, -20, 7, -48);
            pop();
            push();
            rotate(angle);
            fill(255, 255, 255, 200);
            triangle(11, 0, -22, 33, -6, 7);
            rotate(Math.PI / 6);
            triangle(11, 0, -9, 44, -4, 16);
            rotate(Math.PI / 7);
            fill(255, 255, 255, 240);
            triangle(11, 0, 4, 20, 7, 48);
            pop();
            pop();
        }, 255),
        CircleVisual(7, 7, 12, 0, 255, 0, STOCK_COLORS.WHITE)
    ]
};

const PALADIN_VISUAL = {
    LOD0: [
        armoredBody(160, 255, STOCK_COLORS.WHITE, undefined, CAPE_ARR.LOD0, 0, STOCK_COLORS.GOLD),
        CircleVisual(10, 10, 0, 0, 160, 0, STOCK_COLORS.WHITE),
        ShapeVisual(PLUME_ARR.LOD0, 220, 0)
    ],

    LOD1: [
        armoredBody(160, 255, STOCK_COLORS.WHITE, undefined, CAPE_ARR.LOD1, 0, STOCK_COLORS.GOLD),
        CircleVisual(10, 10, 0, 0, 160, 0, STOCK_COLORS.WHITE),
        ShapeVisual(PLUME_ARR.LOD1, 220, 0)
    ],

    LOD2: [
        RectVisual(12, 14, -8, 0, 0, 255, 0),
        RectVisual(4, 15, 0, 0, 0, 180, 1, STOCK_COLORS.WHITE),
        CircleVisual(10, 10, 0, 0, 160, 0, STOCK_COLORS.WHITE),
        PLUME_ARR.LOD2(180)
    ]
};
const PALADIN_1_VISUAL = {
    LOD0: [
        armoredBody(160, 255, STOCK_COLORS.WHITE, undefined, CAPE_2_ARR.LOD0, 0, STOCK_COLORS.GOLD),
        CircleVisual(10, 10, 0, 0, 160, 0, STOCK_COLORS.WHITE),
        ShapeVisual(PLUME_1_ARR.LOD0, 220, 0)
    ],

    LOD1: [
        RectVisual(4, 15, 0, 0, 0, 180, 1, STOCK_COLORS.WHITE),
        RectVisual(9, 16, -4.5, 0, 0, 255, 0),
        CircleVisual(10, 10, 0, 0, 160, 0, STOCK_COLORS.WHITE),
        ShapeVisual(PLUME_1_ARR.LOD1, 220, 0)
    ],

    LOD2: [
        RectVisual(12, 14, -8, 0, 0, 255, 0),
        RectVisual(4, 15, 0, 0, 0, 180, 1, STOCK_COLORS.WHITE),
        CircleVisual(10, 10, 0, 0, 160, 0, STOCK_COLORS.WHITE),
        PLUME_1_ARR.LOD2(220)
    ]
};
const PALADIN_2_VISUAL = {
    LOD0: [
        armoredBody(160, 255, STOCK_COLORS.WHITE, undefined, CAPE_1_ARR.LOD0, 0, STOCK_COLORS.GOLD),
        CircleVisual(10, 10, 0, 0, 160, 0, STOCK_COLORS.WHITE),
        ShapeVisual(PLUME_2_ARR.LOD0, 220, 0)
    ],

    LOD1: [
        armoredBody(160, 255, STOCK_COLORS.WHITE, undefined, CAPE_1_ARR.LOD1, 0, STOCK_COLORS.GOLD),
        CircleVisual(10, 10, 0, 0, 160, 0, STOCK_COLORS.WHITE),
        ShapeVisual(PLUME_2_ARR.LOD1, 220, 0)
    ],

    LOD2: [
        RectVisual(12, 14, -8, 0, 0, 255, 0),
        RectVisual(4, 15, 0, 0, 0, 180, 1, STOCK_COLORS.WHITE),
        CircleVisual(10, 10, 0, 0, 160, 0, STOCK_COLORS.WHITE),
        PLUME_2_ARR.LOD2(220)
    ]
};
const PALADIN_3_VISUAL = {
    LOD0: [
        armoredBody(160, 255, STOCK_COLORS.WHITE, undefined, CAPE_3_ARR.LOD0, 0, STOCK_COLORS.GOLD),
        CircleVisual(10, 10, 0, 0, 160, 0, STOCK_COLORS.WHITE),
        ShapeVisual(PLUME_3_ARR.LOD0, 220, 0)
    ],

    LOD1: [
        armoredBody(160, 255, STOCK_COLORS.WHITE, undefined, CAPE_3_ARR.LOD1, 0, STOCK_COLORS.GOLD),
        CircleVisual(10, 10, 0, 0, 160, 0, STOCK_COLORS.WHITE),
        ShapeVisual(PLUME_3_ARR.LOD1, 220, 0)
    ],

    LOD2: [
        RectVisual(12, 14, -8, 0, 0, 255, 0),
        RectVisual(4, 15, 0, 0, 0, 180, 1, STOCK_COLORS.WHITE),
        CircleVisual(10, 10, 0, 0, 160, 0, STOCK_COLORS.WHITE),
        PLUME_3_ARR.LOD2(220)
    ]
};
const PALADIN_4_VISUAL = {
    LOD0: [
        armoredBody(160, 255, STOCK_COLORS.WHITE, undefined, CAPE_3_ARR.LOD0, 0, STOCK_COLORS.GOLD),
        CircleVisual(10, 10, 0, 0, 160, 0, STOCK_COLORS.WHITE),
        ShapeVisual(PLUME_4_ARR.LOD0, 220, 0)
    ],

    LOD1: [
        armoredBody(160, 255, STOCK_COLORS.WHITE, undefined, CAPE_3_ARR.LOD1, 0, STOCK_COLORS.GOLD),
        CircleVisual(10, 10, 0, 0, 160, 0, STOCK_COLORS.WHITE),
        ShapeVisual(PLUME_4_ARR.LOD1, 220, 0)
    ],

    LOD2: [
        RectVisual(12, 14, -8, 0, 0, 255, 0),
        RectVisual(4, 15, 0, 0, 0, 180, 1, STOCK_COLORS.WHITE),
        CircleVisual(10, 10, 0, 0, 160, 0, STOCK_COLORS.WHITE),
        PLUME_4_ARR.LOD2(220)
    ]
};
const PALADIN_5_VISUAL = {
    LOD0: [
        armoredBody(160, 255, STOCK_COLORS.WHITE, undefined, CAPE_1_ARR.LOD0, 0, STOCK_COLORS.GOLD),
        CircleVisual(10, 10, 0, 0, 160, 0, STOCK_COLORS.WHITE),
        ShapeVisual(PLUME_5_ARR.LOD0, 220, 0)
    ],

    LOD1: [
        armoredBody(160, 255, STOCK_COLORS.WHITE, undefined, CAPE_1_ARR.LOD1, 0, STOCK_COLORS.GOLD),
        CircleVisual(10, 10, 0, 0, 160, 0, STOCK_COLORS.WHITE),
        ShapeVisual(PLUME_5_ARR.LOD1, 220, 0)
    ],

    LOD2: [
        RectVisual(12, 14, -8, 0, 0, 255, 0),
        RectVisual(4, 15, 0, 0, 0, 180, 1, STOCK_COLORS.WHITE),
        CircleVisual(10, 10, 0, 0, 160, 0, STOCK_COLORS.WHITE),
        PLUME_5_ARR.LOD2(220)
    ]
};
const PALADIN_6_VISUAL = {
    LOD0: [
        armoredBody(160, 255, STOCK_COLORS.WHITE, undefined, CAPE_2_ARR.LOD0, 0, STOCK_COLORS.GOLD),
        CircleVisual(10, 10, 0, 0, 160, 0, STOCK_COLORS.WHITE),
        ShapeVisual(PLUME_6_ARR.LOD0, 220, 0)
    ],

    LOD1: [
        armoredBody(160, 255, STOCK_COLORS.WHITE, undefined, CAPE_2_ARR.LOD0, 0, STOCK_COLORS.GOLD),
        CircleVisual(10, 10, 0, 0, 160, 0, STOCK_COLORS.WHITE),
        ShapeVisual(PLUME_6_ARR.LOD1, 220, 0)
    ],

    LOD2: [
        RectVisual(12, 14, -8, 0, 0, 255, 0),
        RectVisual(4, 15, 0, 0, 0, 180, 1, STOCK_COLORS.WHITE),
        CircleVisual(10, 10, 0, 0, 160, 0, STOCK_COLORS.WHITE),
        PLUME_6_ARR.LOD2(220)
    ]
};
const PALADIN_7_VISUAL = {
    LOD0: [
        armoredBody(160, 255, STOCK_COLORS.WHITE, undefined, CAPE_ARR.LOD0, 0, STOCK_COLORS.GOLD),
        CircleVisual(10, 10, 0, 0, 160, 0, STOCK_COLORS.WHITE),
        ShapeVisual(PLUME_7_ARR.LOD0, 220, 0)
    ],

    LOD1: [
        armoredBody(160, 255, STOCK_COLORS.WHITE, undefined, CAPE_ARR.LOD1, 0, STOCK_COLORS.GOLD),
        CircleVisual(10, 10, 0, 0, 160, 0, STOCK_COLORS.WHITE),
        ShapeVisual(PLUME_7_ARR.LOD1, 220, 0)
    ],

    LOD2: [
        RectVisual(12, 14, -8, 0, 0, 255, 0),
        RectVisual(4, 15, 0, 0, 0, 180, 1, STOCK_COLORS.WHITE),
        CircleVisual(10, 10, 0, 0, 160, 0, STOCK_COLORS.WHITE),
        PLUME_7_ARR.LOD2(220)
    ]
};
const PALADIN_8_VISUAL = {
    LOD0: [
        armoredBody(160, 255, STOCK_COLORS.WHITE, undefined, CAPE_1_ARR.LOD0, 0, STOCK_COLORS.GOLD),
        CircleVisual(10, 10, 0, 0, 160, 0, STOCK_COLORS.WHITE),
        ShapeVisual(PLUME_8_ARR.LOD0, 220, 0)
    ],

    LOD1: [
        armoredBody(160, 255, STOCK_COLORS.WHITE, undefined, CAPE_1_ARR.LOD1, 0, STOCK_COLORS.GOLD),
        CircleVisual(10, 10, 0, 0, 160, 0, STOCK_COLORS.WHITE),
        ShapeVisual(PLUME_8_ARR.LOD1, 220, 0)
    ],

    LOD2: [
        RectVisual(12, 14, -8, 0, 0, 255, 0),
        RectVisual(4, 15, 0, 0, 0, 180, 1, STOCK_COLORS.WHITE),
        CircleVisual(10, 10, 0, 0, 160, 0, STOCK_COLORS.WHITE),
        PLUME_8_ARR.LOD2(220)
    ]
};
const PALADIN_9_VISUAL = {
    LOD0: [
        armoredBody(160, 255, STOCK_COLORS.WHITE, undefined, CAPE_2_ARR.LOD0, 0, STOCK_COLORS.GOLD),
        CircleVisual(10, 10, 0, 0, 160, 0, STOCK_COLORS.WHITE),
        ShapeVisual(PLUME_9_ARR.LOD0, 220, 0)
    ],

    LOD1: [
        armoredBody(160, 255, STOCK_COLORS.WHITE, undefined, CAPE_2_ARR.LOD0, 0, STOCK_COLORS.GOLD),
        CircleVisual(10, 10, 0, 0, 160, 0, STOCK_COLORS.WHITE),
        ShapeVisual(PLUME_9_ARR.LOD1, 220, 0)
    ],

    LOD2: [
        RectVisual(12, 14, -8, 0, 0, 255, 0),
        RectVisual(4, 15, 0, 0, 0, 180, 1, STOCK_COLORS.WHITE),
        CircleVisual(10, 10, 0, 0, 160, 0, STOCK_COLORS.WHITE),
        PLUME_9_ARR.LOD2(220)
    ]
};
const PRIEST_VISUAL = {
    LOD0: [
        new Visual(function (x, y, cols, timeElapsed = 0) {
            push();
            translate(x, y);

            fill(255);
            strokeWeight(0);
            rectMode(CENTER);
            rect(0, 0, 4.5, 12);

            fill(...STOCK_COLORS.SCARLET);
            arc(0, -5, 5, 7, PI, 0);
            arc(0, -5, 5, .5, 0, PI);
            arc(0, 5, 5, 7, 0, PI);
            arc(0, 5, 5, .5, PI, 0);
            arc(0, 0, 15, 17, HALF_PI, PI + HALF_PI);
            pop();
        }, 255),
        CircleVisual(10, 10, 0, 0, 180, 0, STOCK_COLORS.WHITE)
    ],
    LOD1: [
        new Visual(function (x, y, cols, timeElapsed = 0) {
            push();
            translate(x, y);

            fill(255);
            strokeWeight(0);
            rectMode(CENTER);
            rect(0, 0, 4.5, 12);

            fill(...STOCK_COLORS.SCARLET);
            arc(0, -5, 5, 7, PI, 0);
            arc(0, -5, 5, .5, 0, PI);
            arc(0, 5, 5, 7, 0, PI);
            arc(0, 5, 5, .5, PI, 0);
            arc(0, 0, 15, 17, HALF_PI, PI + HALF_PI);
            pop();
        }, 255),
        CircleVisual(10, 10, 0, 0, 180, 0, STOCK_COLORS.WHITE)
    ],
    LOD2: [
        new Visual(function (x, y, cols, timeElapsed = 0) {
            push();
            translate(x, y);

            fill(255);
            strokeWeight(0);
            rectMode(CENTER);
            rect(0, 0, 4.5, 12);

            fill(...STOCK_COLORS.SCARLET);
            arc(0, -5, 5, 7, PI, 0);
            arc(0, -5, 5, .5, 0, PI);
            arc(0, 5, 5, 7, 0, PI);
            arc(0, 5, 5, .5, PI, 0);
            arc(0, 0, 15, 17, HALF_PI, PI + HALF_PI);
            pop();
        }, 255),
        CircleVisual(10, 10, 0, 0, 180, 0, STOCK_COLORS.WHITE)
    ]
};

const LIGHTNING_MAGE_VISUAL = {
    LOD0: [
        CircleVisual(8, 8, 0, 0, 255, 0),
        ShapeVisual([
            { x: 2, y: -3.5, curve: false },
            { x: 2, y: -3.5, curve: true },
            { x: 1, y: -1.5, curve: true },
            { x: 1, y: 1.5, curve: true },
            { x: 2, y: 3.5, curve: true },
            { x: 2, y: 3.5, curve: false },
            { x: 0, y: 7, curve: true },
            { x: -6, y: 6, curve: true },
            { x: -4.5, y: 4, curve: true },
            { x: -6.5, y: 1, curve: true },
            { x: -5, y: -1, curve: true },
            { x: -8, y: -4, curve: true },
            { x: -6, y: -6, curve: true },
            { x: 0, y: -7, curve: true },
        ], 255, 0, [109, 135, 181, 255])
    ],
    LOD1: [
        CircleVisual(8, 8, 0, 0, 255, 0),
        ShapeVisual([
            { x: 3, y: -3, curve: true },
            { x: 2, y: -1.5, curve: true },
            { x: 2, y: 1.5, curve: true },
            { x: 3, y: 3, curve: true },
            { x: 0, y: 7, curve: true },
            { x: -6, y: 6, curve: true },
            { x: -4.5, y: 4, curve: true },
            { x: -6.5, y: 1, curve: true },
            { x: -5, y: -1, curve: true },
            { x: -8, y: -4, curve: true },
            { x: -6, y: -6, curve: true },
            { x: 0, y: -7, curve: true },
        ], 255, 0, [109, 135, 181, 255])
    ],
    LOD2: [
        CircleVisual(8, 8, 0, 0, 255, 0),
        ShapeVisual([
            { x: 3, y: 0, curve: true },
            { x: 0, y: 7, curve: true },
            { x: -8, y: 0, curve: true },
            { x: 0, y: -7, curve: true },
        ], 255, 0, [109, 135, 181, 255])
    ]
};
const FLAME_MAGE_VISUAL = {
    LOD0: [
        CircleVisual(8, 8, 0, 0, 255, 0),
        ShapeVisual([
            { x: 2, y: -3.5, curve: false },
            { x: 2, y: -3.5, curve: true },
            { x: 1, y: -1.5, curve: true },
            { x: 1, y: 1.5, curve: true },
            { x: 2, y: 3.5, curve: true },
            { x: 2, y: 3.5, curve: false },
            { x: 0, y: 7, curve: true },
            { x: -6, y: 6, curve: true },
            { x: -4.5, y: 4, curve: true },
            { x: -6.5, y: 1, curve: true },
            { x: -5, y: -1, curve: true },
            { x: -8, y: -4, curve: true },
            { x: -6, y: -6, curve: true },
            { x: 0, y: -7, curve: true },
        ], 255, 0, STOCK_COLORS.FLAME2)
    ],
    LOD1: [
        CircleVisual(8, 8, 0, 0, 255, 0),
        ShapeVisual([
            { x: 3, y: -3, curve: true },
            { x: 2, y: -1.5, curve: true },
            { x: 2, y: 1.5, curve: true },
            { x: 3, y: 3, curve: true },
            { x: 0, y: 7, curve: true },
            { x: -6, y: 6, curve: true },
            { x: -4.5, y: 4, curve: true },
            { x: -6.5, y: 1, curve: true },
            { x: -5, y: -1, curve: true },
            { x: -8, y: -4, curve: true },
            { x: -6, y: -6, curve: true },
            { x: 0, y: -7, curve: true },
        ], 255, 0, STOCK_COLORS.FLAME2)
    ],
    LOD2: [
        CircleVisual(8, 8, 0, 0, 255, 0),
        ShapeVisual([
            { x: 3, y: 0, curve: true },
            { x: 0, y: 7, curve: true },
            { x: -8, y: 0, curve: true },
            { x: 0, y: -7, curve: true },
        ], 255, 0, STOCK_COLORS.FLAME2)
    ]
};
const MAGE_VISUAL = {
    LOD0: [
        CircleVisual(8, 8, 0, 0, 200, 0),
        ShapeVisual([
            { x: 2, y: -3.5, curve: false },
            { x: 2, y: -3.5, curve: true },
            { x: 1, y: -1.5, curve: true },
            { x: 1, y: 1.5, curve: true },
            { x: 2, y: 3.5, curve: true },
            { x: 2, y: 3.5, curve: false },
            { x: 0, y: 7, curve: true },
            { x: -6, y: 6, curve: true },
            { x: -4.5, y: 4, curve: true },
            { x: -6.5, y: 1, curve: true },
            { x: -5, y: -1, curve: true },
            { x: -8, y: -4, curve: true },
            { x: -6, y: -6, curve: true },
            { x: 0, y: -7, curve: true },
        ], 255, 0)
    ],
    LOD1: [
        CircleVisual(8, 8, 0, 0, 200, 0),
        ShapeVisual([
            { x: 3, y: -3, curve: true },
            { x: 2, y: -1.5, curve: true },
            { x: 2, y: 1.5, curve: true },
            { x: 3, y: 3, curve: true },
            { x: 0, y: 7, curve: true },
            { x: -6, y: 6, curve: true },
            { x: -4.5, y: 4, curve: true },
            { x: -6.5, y: 1, curve: true },
            { x: -5, y: -1, curve: true },
            { x: -8, y: -4, curve: true },
            { x: -6, y: -6, curve: true },
            { x: 0, y: -7, curve: true },
        ], 255, 0)
    ],
    LOD2: [
        CircleVisual(8, 8, 0, 0, 200, 0),
        ShapeVisual([
            { x: 3, y: 0, curve: true },
            { x: 0, y: 7, curve: true },
            { x: -8, y: 0, curve: true },
            { x: 0, y: -7, curve: true },
        ], 255, 0)
    ]
};

const CATAPULT_VISUAL = {
    LOD0: [
        RectVisual(5, 40, 20, 0, 0, 190, 0, STOCK_COLORS.WOOD),
        RectVisual(5, 40, -20, 0, 0, 190, 0, STOCK_COLORS.WOOD),
        RectVisual(5, 40, 0, 0, 0, 190, 0, STOCK_COLORS.WOOD),
        RectVisual(60, 5, 0, 17.5, 0, 255, 0, STOCK_COLORS.WOOD),
        RectVisual(60, 5, 0, -17.5, 0, 255, 0, STOCK_COLORS.WOOD),
        RectVisual(35, 5, -17.5, 0, 0, 255, 0, STOCK_COLORS.WOOD),
        CircleVisual(20, 15, -35, 0, 255, 0, STOCK_COLORS.WOOD),
        RectVisual(10, 2, 20, 21, 0, 190, 0, STOCK_COLORS.WHITE),
        RectVisual(10, 2, 20, -21, 0, 190, 0, STOCK_COLORS.WHITE),
        RectVisual(10, 2, -20, -21, 0, 190, 0, STOCK_COLORS.WHITE),
        RectVisual(10, 2, -20, 21, 0, 190, 0, STOCK_COLORS.WHITE)
    ],
    LOD1: [
        RectVisual(5, 40, 20, 0, 0, 190, 0, STOCK_COLORS.WOOD),
        RectVisual(5, 40, -20, 0, 0, 190, 0, STOCK_COLORS.WOOD),
        RectVisual(5, 40, 0, 0, 0, 190, 0, STOCK_COLORS.WOOD),
        RectVisual(60, 5, 0, 17.5, 0, 255, 0, STOCK_COLORS.WOOD),
        RectVisual(60, 5, 0, -17.5, 0, 255, 0, STOCK_COLORS.WOOD),
        RectVisual(35, 5, -17.5, 0, 0, 255, 0, STOCK_COLORS.WOOD),
        CircleVisual(20, 15, -35, 0, 255, 0, STOCK_COLORS.WOOD),
        RectVisual(10, 2, 20, 21, 0, 190, 0, STOCK_COLORS.WHITE),
        RectVisual(10, 2, 20, -21, 0, 190, 0, STOCK_COLORS.WHITE),
        RectVisual(10, 2, -20, -21, 0, 190, 0, STOCK_COLORS.WHITE),
        RectVisual(10, 2, -20, 21, 0, 190, 0, STOCK_COLORS.WHITE)
    ],
    LOD2: [
        RectVisual(5, 40, 20, 0, 0, 190, 0, STOCK_COLORS.WOOD),
        RectVisual(5, 40, -20, 0, 0, 190, 0, STOCK_COLORS.WOOD),
        RectVisual(5, 40, 0, 0, 0, 190, 0, STOCK_COLORS.WOOD),
        RectVisual(60, 5, 0, 17.5, 0, 255, 0, STOCK_COLORS.WOOD),
        RectVisual(60, 5, 0, -17.5, 0, 255, 0, STOCK_COLORS.WOOD),
        RectVisual(35, 5, -17.5, 0, 0, 255, 0, STOCK_COLORS.WOOD),
        CircleVisual(20, 15, -35, 0, 255, 0, STOCK_COLORS.WOOD)
    ]
};

const ZOMBIE_VISUAL = {
    LOD0: [
        RectVisual(4, 15, 0, 0, 0, 220, 0, [63, 63, 63, 255]),
        CircleVisual(10, 10, 0, 0, 255, 0, [63, 63, 63, 255])
    ],
    LOD1: [
        RectVisual(4, 15, 0, 0, 0, 220, 0, [63, 63, 63, 255]),
        CircleVisual(10, 10, 0, 0, 255, 0, [63, 63, 63, 255])
    ],
    LOD2: [
        RectVisual(4, 15, 0, 0, 0, 220, 0, [63, 63, 63, 255]),
        CircleVisual(10, 10, 0, 0, 255, 0, [63, 63, 63, 255])
    ]
};

const SKELETON_VISUAL = {
    LOD0: [
        RectVisual(3, 12, 0, 0, 0, 240, 0, STOCK_COLORS.BONE),
        CircleVisual(8, 8, 0, 0, 255, 0, STOCK_COLORS.BONE)
    ],
    LOD1: [
        RectVisual(3, 12, 0, 0, 0, 240, 0, STOCK_COLORS.BONE),
        CircleVisual(8, 8, 0, 0, 255, 0, STOCK_COLORS.BONE)
    ],
    LOD2: [
        RectVisual(3, 12, 0, 0, 0, 240, 0, STOCK_COLORS.BONE),
        CircleVisual(8, 8, 0, 0, 255, 0, STOCK_COLORS.BONE)
    ]
};

const REAPER_VISUAL = {
    LOD0: [
        CircleVisual(8, 8, 0, 0, 255, 0, STOCK_COLORS.BONE),
        ShapeVisual([
            { x: 3, y: -3, curve: true },
            { x: 2, y: -1.5, curve: true },
            { x: 2, y: 1.5, curve: true },
            { x: 3, y: 3, curve: true },
            { x: 0, y: 7, curve: true },
            { x: -6, y: 6, curve: true },
            { x: -4.5, y: 4, curve: true },
            { x: -6.5, y: 1, curve: true },
            { x: -5, y: -1, curve: true },
            { x: -8, y: -4, curve: true },
            { x: -6, y: -6, curve: true },
            { x: 0, y: -7, curve: true },
        ], 255, 0, [0, 0, 0, 150])
    ],
    LOD1: [
        CircleVisual(8, 8, 0, 0, 255, 0, STOCK_COLORS.BONE),
        ShapeVisual([
            { x: 3, y: 0, curve: true },
            { x: 0, y: 7, curve: true },
            { x: -6, y: 6, curve: true },
            { x: -6.5, y: 1, curve: true },
            { x: -8, y: -4, curve: true },
            { x: 0, y: -7, curve: true },
        ], 255, 0, [0, 0, 0, 150])
    ],
    LOD2: [
        CircleVisual(8, 8, 0, 0, 255, 0, STOCK_COLORS.BONE),
        ShapeVisual([
            { x: 3, y: 0, curve: true },
            { x: 0, y: 7, curve: true },
            { x: -8, y: 0, curve: true },
            { x: 0, y: -7, curve: true },
        ], 255, 0, [0, 0, 0, 150])
    ]
};
const REAPER_1_VISUAL = {
    LOD0: [
        CircleVisual(8, 8, 0, 0, 255, 0, STOCK_COLORS.BONE),
        ShapeVisual([
            { x: 3, y: -3, curve: true },
            { x: 2, y: -1.5, curve: true },
            { x: 2, y: 1.5, curve: true },
            { x: 3, y: 3, curve: true },
            { x: 0, y: 7, curve: true },
            { x: -4, y: 6, curve: true },
            { x: -7, y: 4, curve: true },
            { x: -9, y: 1, curve: true },
            { x: -7, y: -1, curve: true },
            { x: -7.1, y: -4, curve: true },
            { x: -6, y: -6, curve: true },
            { x: 0, y: -7, curve: true },
        ], 255, 0, [0, 0, 0, 150])
    ],
    LOD1: [
        CircleVisual(8, 8, 0, 0, 255, 0, STOCK_COLORS.BONE),
        ShapeVisual([
            { x: 3, y: 0, curve: true },
            { x: 0, y: 7, curve: true },
            { x: -7, y: 4, curve: true },
            { x: -9, y: 1, curve: true },
            { x: -6, y: -6, curve: true },
            { x: 0, y: -7, curve: true },
        ], 255, 0, [0, 0, 0, 150])
    ],
    LOD2: [
        CircleVisual(8, 8, 0, 0, 255, 0, STOCK_COLORS.BONE),
        ShapeVisual([
            { x: 3, y: 0, curve: true },
            { x: 0, y: 7, curve: true },
            { x: -8, y: 0, curve: true },
            { x: 0, y: -7, curve: true },
        ], 255, 0, [0, 0, 0, 150])
    ]
};
const REAPER_2_VISUAL = {
    LOD0: [
        CircleVisual(8, 8, 0, 0, 255, 0, STOCK_COLORS.BONE),
        ShapeVisual([
            { x: 3, y: -3, curve: true },
            { x: 2, y: -1.5, curve: true },
            { x: 2, y: 1.5, curve: true },
            { x: 3, y: 3, curve: true },
            { x: 0, y: 7, curve: true },
            { x: -7, y: 6, curve: true },
            { x: -5, y: 4, curve: true },
            { x: -6, y: 1, curve: true },
            { x: -8, y: -1, curve: true },
            { x: -5, y: -4, curve: true },
            { x: -6.5, y: -6, curve: true },
            { x: 0, y: -7, curve: true },
        ], 255, 0, [0, 0, 0, 150])
    ],
    LOD1: [
        CircleVisual(8, 8, 0, 0, 255, 0, STOCK_COLORS.BONE),
        ShapeVisual([
            { x: 3, y: 0, curve: true },
            { x: 0, y: 7, curve: true },
            { x: -7, y: 6, curve: true },
            { x: -5, y: 4, curve: true },
            { x: -8, y: -1, curve: true },
            { x: -6.5, y: -6, curve: true },
            { x: 0, y: -7, curve: true },
        ], 255, 0, [0, 0, 0, 150])
    ],
    LOD2: [
        CircleVisual(8, 8, 0, 0, 255, 0, STOCK_COLORS.BONE),
        ShapeVisual([
            { x: 3, y: 0, curve: true },
            { x: 0, y: 7, curve: true },
            { x: -8, y: 0, curve: true },
            { x: 0, y: -7, curve: true },
        ], 255, 0, [0, 0, 0, 150])
    ]
};
const REAPER_3_VISUAL = {
    LOD0: [
        CircleVisual(8, 8, 0, 0, 255, 0, STOCK_COLORS.BONE),
        ShapeVisual([
            { x: 3, y: 3, curve: true },
            { x: 2, y: 1.5, curve: true },
            { x: 2, y: -1.5, curve: true },
            { x: 3, y: -3, curve: true },
            { x: 0, y: -7, curve: true },
            { x: -7, y: -6, curve: true },
            { x: -5, y: -4, curve: true },
            { x: -6, y: -1, curve: true },
            { x: -8, y: 1, curve: true },
            { x: -5, y: 4, curve: true },
            { x: -6.5, y: 6, curve: true },
            { x: 0, y: 7, curve: true },
        ], 255, 0, [0, 0, 0, 150])
    ],
    LOD1: [
        CircleVisual(8, 8, 0, 0, 255, 0, STOCK_COLORS.BONE),
        ShapeVisual([
            { x: 3, y: 0, curve: true },
            { x: 0, y: -7, curve: true },
            { x: -7, y: -6, curve: true },
            { x: -5, y: -4, curve: true },
            { x: -8, y: 1, curve: true },
            { x: -6.5, y: 6, curve: true },
            { x: 0, y: 7, curve: true },
        ], 255, 0, [0, 0, 0, 150])
    ],
    LOD2: [
        CircleVisual(8, 8, 0, 0, 255, 0, STOCK_COLORS.BONE),
        ShapeVisual([
            { x: 3, y: 0, curve: true },
            { x: 0, y: 7, curve: true },
            { x: -8, y: 0, curve: true },
            { x: 0, y: -7, curve: true },
        ], 255, 0, [0, 0, 0, 150])
    ]
};
const REAPER_4_VISUAL = {
    LOD0: [
        CircleVisual(8, 8, 0, 0, 255, 0, STOCK_COLORS.BONE),
        ShapeVisual([
            { x: 3, y: 3, curve: true },
            { x: 2, y: 1.5, curve: true },
            { x: 2, y: -1.5, curve: true },
            { x: 3, y: -3, curve: true },
            { x: 0, y: -7, curve: true },
            { x: -6, y: -6, curve: true },
            { x: -4.5, y: -4, curve: true },
            { x: -6.5, y: -1, curve: true },
            { x: -5, y: 1, curve: true },
            { x: -8, y: 4, curve: true },
            { x: -6, y: 6, curve: true },
            { x: 0, y: 7, curve: true },
        ], 255, 0, [0, 0, 0, 150])
    ],
    LOD1: [
        CircleVisual(8, 8, 0, 0, 255, 0, STOCK_COLORS.BONE),
        ShapeVisual([
            { x: 3, y: 0, curve: true },
            { x: 0, y: -7, curve: true },
            { x: -6, y: -6, curve: true },
            { x: -6.5, y: -1, curve: true },
            { x: -8, y: 4, curve: true },
            { x: 0, y: 7, curve: true },
        ], 255, 0, [0, 0, 0, 150])
    ],
    LOD2: [
        CircleVisual(8, 8, 0, 0, 255, 0, STOCK_COLORS.BONE),
        ShapeVisual([
            { x: 3, y: 0, curve: true },
            { x: 0, y: 7, curve: true },
            { x: -8, y: 0, curve: true },
            { x: 0, y: -7, curve: true },
        ], 255, 0, [0, 0, 0, 150])
    ]
};
const REAPER_5_VISUAL = {
    LOD0: [
        CircleVisual(8, 8, 0, 0, 255, 0, STOCK_COLORS.BONE),
        ShapeVisual([
            { x: 3, y: 3, curve: true },
            { x: 2, y: 1.5, curve: true },
            { x: 2, y: -1.5, curve: true },
            { x: 3, y: -3, curve: true },
            { x: 0, y: -7, curve: true },
            { x: -4, y: -6, curve: true },
            { x: -7, y: -4, curve: true },
            { x: -9, y: -1, curve: true },
            { x: -7, y: 1, curve: true },
            { x: -7.1, y: 4, curve: true },
            { x: -6, y: 6, curve: true },
            { x: 0, y: 7, curve: true },
        ], 255, 0, [0, 0, 0, 150])
    ],
    LOD1: [
        CircleVisual(8, 8, 0, 0, 255, 0, STOCK_COLORS.BONE),
        ShapeVisual([
            { x: 3, y: 0, curve: true },
            { x: 0, y: -7, curve: true },
            { x: -7, y: -4, curve: true },
            { x: -9, y: -1, curve: true },
            { x: -6, y: 6, curve: true },
            { x: 0, y: 7, curve: true },
        ], 255, 0, [0, 0, 0, 150])
    ],
    LOD2: [
        CircleVisual(8, 8, 0, 0, 255, 0, STOCK_COLORS.BONE),
        ShapeVisual([
            { x: 3, y: 0, curve: true },
            { x: 0, y: 7, curve: true },
            { x: -8, y: 0, curve: true },
            { x: 0, y: -7, curve: true },
        ], 255, 0, [0, 0, 0, 150])
    ]
};

const BLOOD_MAGE_VISUAL = {
    LOD0: [
        CircleVisual(8, 8, 0, 0, 255, 0, STOCK_COLORS.WHITE),
        ShapeVisual([
            { x: 2, y: -3.5, curve: false },
            { x: 2, y: -3.5, curve: true },
            { x: 1, y: -1.5, curve: true },
            { x: 1, y: 1.5, curve: true },
            { x: 2, y: 3.5, curve: true },
            { x: 2, y: 3.5, curve: false },
            { x: 0, y: 7, curve: true },
            { x: -6, y: 6, curve: true },
            { x: -4.5, y: 4, curve: true },
            { x: -6.5, y: 1, curve: true },
            { x: -5, y: -1, curve: true },
            { x: -8, y: -4, curve: true },
            { x: -6, y: -6, curve: true },
            { x: 0, y: -7, curve: true },
        ], 0, 0, STOCK_COLORS.WHITE),

        // Fangs
        TriangleVisual(
            3.5, 1,
            3.5, 0.25,
            4.5, 0.625,
            150, 0,
            STOCK_COLORS.WHITE
        ),

        TriangleVisual(
            3.5, -1,
            3.5, -0.25,
            4.5, -0.625,
            150, 0,
            STOCK_COLORS.WHITE
        )
    ],
    LOD1: [
        CircleVisual(8, 8, 0, 0, 255, 0, STOCK_COLORS.WHITE),
        ShapeVisual([
            { x: 3, y: -3, curve: true },
            { x: 2, y: -1.5, curve: true },
            { x: 2, y: 1.5, curve: true },
            { x: 3, y: 3, curve: true },
            { x: 0, y: 7, curve: true },
            { x: -6, y: 6, curve: true },
            { x: -4.5, y: 4, curve: true },
            { x: -6.5, y: 1, curve: true },
            { x: -5, y: -1, curve: true },
            { x: -8, y: -4, curve: true },
            { x: -6, y: -6, curve: true },
            { x: 0, y: -7, curve: true },
        ], 0, 0, STOCK_COLORS.WHITE)
    ],
    LOD2: [
        CircleVisual(8, 8, 0, 0, 255, 0, STOCK_COLORS.WHITE),
        ShapeVisual([
            { x: 3, y: 0, curve: true },
            { x: 0, y: 7, curve: true },
            { x: -8, y: 0, curve: true },
            { x: 0, y: -7, curve: true },
        ], 0, 0, STOCK_COLORS.WHITE)
    ]
};

const SPIRIT_VISUAL = {
    LOD0: [
        ShapeVisual([
            { x: 4, y: 0, curve: true },
            { x: 0, y: 7, curve: true },
            { x: -6, y: 6, curve: true },
            { x: -4.5, y: 4, curve: true },
            { x: -6.5, y: 1, curve: true },
            { x: -5, y: -1, curve: true },
            { x: -8, y: -4, curve: true },
            { x: -6, y: -6, curve: true },
            { x: 0, y: -7, curve: true },
        ], 255, 0, [34, 96, 119, 100]),
        CircleVisual(8, 8, 0, 0, 255, 0, [34, 96, 119, 100])
    ],
    LOD1: [
        ShapeVisual([
            { x: 4, y: 0, curve: true },
            { x: 0, y: 7, curve: true },
            { x: -6, y: 6, curve: true },
            { x: -6.5, y: 1, curve: true },
            { x: -8, y: -4, curve: true },
            { x: 0, y: -7, curve: true },
        ], 255, 0, [34, 96, 119, 100]),
        CircleVisual(8, 8, 0, 0, 255, 0, [34, 96, 119, 100])
    ],
    LOD2: [
        ShapeVisual([
            { x: 4, y: 0, curve: true },
            { x: 0, y: 7, curve: true },
            { x: -8, y: 0, curve: true },
            { x: 0, y: -7, curve: true },
        ], 255, 0, [34, 96, 119, 100]),
        CircleVisual(8, 8, 0, 0, 255, 0, [34, 96, 119, 100])
    ]
};
const SPIRIT_1_VISUAL = {
    LOD0: [
        ShapeVisual([
            { x: 4, y: 0, curve: true },
            { x: 0, y: 7, curve: true },
            { x: -4, y: 6, curve: true },
            { x: -7, y: 4, curve: true },
            { x: -9, y: 1, curve: true },
            { x: -7, y: -1, curve: true },
            { x: -7.1, y: -4, curve: true },
            { x: -6, y: -6, curve: true },
            { x: 0, y: -7, curve: true },
        ], 255, 0, [118, 143, 165, 100]),
        CircleVisual(8, 8, 0, 0, 255, 0, [118, 143, 165, 100])
    ],
    LOD1: [
        ShapeVisual([
            { x: 4, y: 0, curve: true },
            { x: 0, y: 7, curve: true },
            { x: -7, y: 4, curve: true },
            { x: -9, y: 1, curve: true },
            { x: -6, y: -6, curve: true },
            { x: 0, y: -7, curve: true },
        ], 255, 0, [118, 143, 165, 100]),
        CircleVisual(8, 8, 0, 0, 255, 0, [118, 143, 165, 100])
    ],
    LOD2: [
        ShapeVisual([
            { x: 4, y: 0, curve: true },
            { x: 0, y: 7, curve: true },
            { x: -8, y: 0, curve: true },
            { x: 0, y: -7, curve: true },
        ], 255, 0, [118, 143, 165, 100]),
        CircleVisual(8, 8, 0, 0, 255, 0, [118, 143, 165, 100])
    ]
};
const SPIRIT_2_VISUAL = {
    LOD0: [
        ShapeVisual([
            { x: 4, y: 0, curve: true },
            { x: 0, y: 7, curve: true },
            { x: -7, y: 6, curve: true },
            { x: -5, y: 4, curve: true },
            { x: -6, y: 1, curve: true },
            { x: -8, y: -1, curve: true },
            { x: -5, y: -4, curve: true },
            { x: -6.5, y: -6, curve: true },
            { x: 0, y: -7, curve: true },
        ], 255, 0, [12, 35, 79, 100]),
        CircleVisual(8, 8, 0, 0, 255, 0, [12, 35, 79, 100])
    ],
    LOD1: [
        ShapeVisual([
            { x: 4, y: 0, curve: true },
            { x: 0, y: 7, curve: true },
            { x: -7, y: 6, curve: true },
            { x: -5, y: 4, curve: true },
            { x: -8, y: -1, curve: true },
            { x: -6.5, y: -6, curve: true },
            { x: 0, y: -7, curve: true },
        ], 255, 0, [12, 35, 79, 100]),
        CircleVisual(8, 8, 0, 0, 255, 0, [12, 35, 79, 100])
    ],
    LOD2: [
        ShapeVisual([
            { x: 4, y: 0, curve: true },
            { x: 0, y: 7, curve: true },
            { x: -8, y: 0, curve: true },
            { x: 0, y: -7, curve: true },
        ], 255, 0, [12, 35, 79, 100]),
        CircleVisual(8, 8, 0, 0, 255, 0, [12, 35, 79, 100])
    ]
};
const SPIRIT_3_VISUAL = {
    LOD0: [
        ShapeVisual([
            { x: 4, y: 0, curve: true },
            { x: 0, y: -7, curve: true },
            { x: -7, y: -6, curve: true },
            { x: -5, y: -4, curve: true },
            { x: -6, y: -1, curve: true },
            { x: -8, y: 1, curve: true },
            { x: -5, y: 4, curve: true },
            { x: -6.5, y: 6, curve: true },
            { x: 0, y: 7, curve: true },
        ], 255, 0, [34, 96, 119, 100]),
        CircleVisual(8, 8, 0, 0, 255, 0, [34, 96, 119, 100])
    ],
    LOD1: [
        ShapeVisual([
            { x: 4, y: 0, curve: true },
            { x: 0, y: -7, curve: true },
            { x: -7, y: -6, curve: true },
            { x: -5, y: -4, curve: true },
            { x: -8, y: 1, curve: true },
            { x: -6.5, y: 6, curve: true },
            { x: 0, y: 7, curve: true },
        ], 255, 0, [34, 96, 119, 100]),
        CircleVisual(8, 8, 0, 0, 255, 0, [34, 96, 119, 100])
    ],
    LOD2: [
        ShapeVisual([
            { x: 4, y: 0, curve: true },
            { x: 0, y: 7, curve: true },
            { x: -8, y: 0, curve: true },
            { x: 0, y: -7, curve: true },
        ], 255, 0, [34, 96, 119, 100]),
        CircleVisual(8, 8, 0, 0, 255, 0, [34, 96, 119, 100])
    ]
};
const SPIRIT_4_VISUAL = {
    LOD0: [
        ShapeVisual([
            { x: 4, y: 0, curve: true },
            { x: 0, y: -7, curve: true },
            { x: -6, y: -6, curve: true },
            { x: -4.5, y: -4, curve: true },
            { x: -6.5, y: -1, curve: true },
            { x: -5, y: 1, curve: true },
            { x: -8, y: 4, curve: true },
            { x: -6, y: 6, curve: true },
            { x: 0, y: 7, curve: true },
        ], 255, 0, [118, 143, 165, 100]),
        CircleVisual(8, 8, 0, 0, 255, 0, [118, 143, 165, 100])
    ],
    LOD1: [
        ShapeVisual([
            { x: 4, y: 0, curve: true },
            { x: 0, y: -7, curve: true },
            { x: -6, y: -6, curve: true },
            { x: -6.5, y: -1, curve: true },
            { x: -8, y: 4, curve: true },
            { x: 0, y: 7, curve: true },
        ], 255, 0, [118, 143, 165, 100]),
        CircleVisual(8, 8, 0, 0, 255, 0, [118, 143, 165, 100])
    ],
    LOD2: [
        ShapeVisual([
            { x: 4, y: 0, curve: true },
            { x: 0, y: 7, curve: true },
            { x: -8, y: 0, curve: true },
            { x: 0, y: -7, curve: true },
        ], 255, 0, [118, 143, 165, 100]),
        CircleVisual(8, 8, 0, 0, 255, 0, [118, 143, 165, 100])
    ]
};
const SPIRIT_5_VISUAL = {
    LOD0: [
        ShapeVisual([
            { x: 4, y: 0, curve: true },
            { x: 0, y: -7, curve: true },
            { x: -4, y: -6, curve: true },
            { x: -7, y: -4, curve: true },
            { x: -9, y: -1, curve: true },
            { x: -7, y: 1, curve: true },
            { x: -7.1, y: 4, curve: true },
            { x: -6, y: 6, curve: true },
            { x: 0, y: 7, curve: true },
        ], 255, 0, [12, 35, 79, 100]),
        CircleVisual(8, 8, 0, 0, 255, 0, [12, 35, 79, 100])
    ],
    LOD1: [
        ShapeVisual([
            { x: 4, y: 0, curve: true },
            { x: 0, y: -7, curve: true },
            { x: -7, y: -4, curve: true },
            { x: -9, y: -1, curve: true },
            { x: -6, y: 6, curve: true },
            { x: 0, y: 7, curve: true },
        ], 255, 0, [12, 35, 79, 100]),
        CircleVisual(8, 8, 0, 0, 255, 0, [12, 35, 79, 100])
    ],
    LOD2: [
        ShapeVisual([
            { x: 4, y: 0, curve: true },
            { x: 0, y: 7, curve: true },
            { x: -8, y: 0, curve: true },
            { x: 0, y: -7, curve: true },
        ], 255, 0, [12, 35, 79, 100]),
        CircleVisual(8, 8, 0, 0, 255, 0, [12, 35, 79, 100])
    ]
};

const SPECTRAL_MOVE_VISUAL = (x, y, a) => {
    const visual = new TemporaryVisual(function () {
        push();
        translate(this.x, this.y);
        rotate(this.a);
        noStroke();

        const time = this.timeElapsed;

        for (const p of this.particles) {
            const t = ((time / this.cycle + p.offset) % 1 + 1) % 1;
            const envelope = Math.pow(Math.sin(Math.PI * t), 0.7);
            const radius = p.r * (0.8 + 0.4 * t);
            const alpha = p.alpha * envelope * this.transparency;
            if (alpha < 30 && camera.lod !== LOD.LOD0)
                continue;

            // Drift backward and gently swirl.
            const px = p.x - 9 * t;
            const py = p.y + Math.sin(t * TWO_PI + p.phase) * 2;

            // Fade smoothly as the particle completes its loop.

            fill(12, 35, 79, alpha);
            ellipse(px, py, radius * 2, radius * 2);
        }

        pop();
    }, 255, 0.75);

    visual.x = x;
    visual.y = y;
    visual.a = a;
    visual.cycle = 0.75;

    visual.particles = Array.from({ length: 10 }, (_, i) => {
        const angle = i * 2.39996;
        const distance = 1.5 + (i % 3) * 1.5;

        return {
            x: Math.cos(angle) * distance,
            y: Math.sin(angle) * distance,
            r: 1.5 + (i % 3) * 0.75,
            alpha: 20 + (i % 3) * 5,
            offset: (i / 10 + (i % 3) * 0.07) % 1,
            phase: angle
        };
    });

    return visual;
};
const REAPER_MOVE_VISUAL = (x, y, a) => {
    const visual = new TemporaryVisual(function () {
        push();
        translate(this.x, this.y);
        rotate(this.a);
        noStroke();

        const time = this.timeElapsed;

        for (const p of this.particles) {
            const t = ((time / this.cycle + p.offset) % 1 + 1) % 1;
            const envelope = Math.pow(Math.sin(Math.PI * t), 0.7);
            const radius = p.r * (0.8 + 0.4 * t);
            const alpha = p.alpha * envelope * this.transparency;
            if (alpha < 30 && camera.lod !== LOD.LOD0)
                continue;

            // Drift backward and gently swirl.
            const px = p.x - 9 * t;
            const py = p.y + Math.sin(t * TWO_PI + p.phase) * 2;

            fill(0, 0, 0, alpha);
            ellipse(px, py, radius * 2, radius * 2);
        }

        pop();
    }, 255, 0.75);

    visual.x = x;
    visual.y = y;
    visual.a = a;
    visual.cycle = 0.75;

    visual.particles = Array.from({ length: 10 }, (_, i) => {
        const angle = i * 2.39996;
        const distance = 1.5 + (i % 3) * 1.5;

        return {
            x: Math.cos(angle) * distance,
            y: Math.sin(angle) * distance,
            r: 1.5 + (i % 3) * 0.75,
            alpha: 20 + (i % 3) * 5,
            offset: (i / 10 + (i % 3) * 0.07) % 1,
            phase: angle
        };
    });

    return visual;
};
const SMOKE_MOVE_VISUAL = (x, y, a) => {
    const visual = new TemporaryVisual(function () {
        push();
        translate(this.x, this.y);
        rotate(this.a);
        noStroke();

        const time = this.timeElapsed;
        const cycle = this.cycle;

        for (const p of this.particles) {
            // Each particle loops independently through the cycle.
            const t = ((time / cycle + p.offset) % 1 + 1) % 1;
            // Wisps swell, then dissipate before returning.
            const envelope = Math.pow(Math.sin(Math.PI * t), 0.7);
            const radius = p.r * (0.8 + 0.4 * t);
            const alpha = p.alpha * envelope * this.transparency;
            if (alpha < 20 && camera.lod !== LOD.LOD0)
                continue;


            // Drift backward while wandering around the vampire.
            const px = p.x - 15 * t;
            const py = p.y + Math.sin(t * TWO_PI + p.phase) * 3;

            fill(28, 25, 32, alpha);
            ellipse(px, py, radius * 2, radius * 2);
        }

        pop();
    }, 255, 0.75);

    visual.x = x;
    visual.y = y;
    visual.a = a;
    visual.cycle = 1.5;

    // Offset particles throughout the cycle so the smoke is continuous.
    visual.particles = Array.from({ length: 28 }, (_, i) => {
        const angle = i * 2.39996;
        const distance = 2 + (i % 5) * 1.7;

        return {
            x: Math.cos(angle) * distance,
            y: Math.sin(angle) * distance * 1.35,
            r: 2.5 + (i % 4) * 1.1,
            alpha: 35 + (i % 4) * 12,
            offset: (i * 0.61803398875) % 1,
            phase: angle
        };
    });

    return visual;
};
const VAMPIRE_VISUAL = {
    LOD0: [
        armoredBody(0, 255, STOCK_COLORS.WHITE, STOCK_COLORS.CRIMSON, CAPE_ARR.LOD0, 0, STOCK_COLORS.GOLD),
        // RectVisual(4, 15, 0, 0, 0, 0, 1, STOCK_COLORS.WHITE),
        // ShapeVisual(CAPE_ARR.LOD0, 255, 1, STOCK_COLORS.CRIMSON),
        CircleVisual(10, 10, 0, 0, 20, 0, STOCK_COLORS.WHITE),
        ShapeVisual(PLUME_ARR.LOD0, 255, 0)
    ],

    LOD1: [
        armoredBody(0, 255, STOCK_COLORS.WHITE, STOCK_COLORS.CRIMSON, CAPE_ARR.LOD1, 0, STOCK_COLORS.GOLD),
        // RectVisual(4, 15, 0, 0, 0, 0, 1, STOCK_COLORS.WHITE),
        // ShapeVisual(CAPE_ARR.LOD1, 255, 1, STOCK_COLORS.CRIMSON),
        CircleVisual(10, 10, 0, 0, 20, 0, STOCK_COLORS.WHITE),
        ShapeVisual(PLUME_ARR.LOD1, 255, 0)
    ],

    LOD2: [
        RectVisual(12, 14, -8, 0, 0, 255, 0, STOCK_COLORS.CRIMSON),
        RectVisual(4, 15, 0, 0, 0, 0, 1, STOCK_COLORS.WHITE),
        CircleVisual(10, 10, 0, 0, 20, 0, STOCK_COLORS.WHITE),
        PLUME_ARR.LOD2(180)
    ]
};
const VAMPIRE_1_VISUAL = {
    LOD0: [
        armoredBody(0, 255, STOCK_COLORS.WHITE, STOCK_COLORS.CRIMSON, CAPE_2_ARR.LOD0, 0, STOCK_COLORS.GOLD),
        // RectVisual(4, 15, 0, 0, 0, 0, 1, STOCK_COLORS.WHITE),
        // ShapeVisual(CAPE_2_ARR.LOD0, 255, 1, STOCK_COLORS.CRIMSON),
        CircleVisual(10, 10, 0, 0, 20, 0, STOCK_COLORS.WHITE),
        ShapeVisual(PLUME_1_ARR.LOD0, 255, 0)
    ],

    LOD1: [
        RectVisual(4, 15, 0, 0, 0, 0, 1, STOCK_COLORS.WHITE),
        RectVisual(9, 16, -4.5, 0, 0, 255, 0, STOCK_COLORS.CRIMSON),
        CircleVisual(10, 10, 0, 0, 20, 0, STOCK_COLORS.WHITE),
        ShapeVisual(PLUME_1_ARR.LOD1, 255, 0)
    ],

    LOD2: [
        RectVisual(12, 14, -8, 0, 0, 255, 0, STOCK_COLORS.CRIMSON),
        RectVisual(4, 15, 0, 0, 0, 0, 1, STOCK_COLORS.WHITE),
        CircleVisual(10, 10, 0, 0, 20, 0, STOCK_COLORS.WHITE),
        PLUME_1_ARR.LOD2(180)
    ]
};
const VAMPIRE_2_VISUAL = {
    LOD0: [
        armoredBody(0, 255, STOCK_COLORS.WHITE, STOCK_COLORS.CRIMSON, CAPE_1_ARR.LOD0, 0, STOCK_COLORS.GOLD),
        // RectVisual(4, 15, 0, 0, 0, 0, 1, STOCK_COLORS.WHITE),
        // ShapeVisual(CAPE_1_ARR.LOD0, 255, 1, STOCK_COLORS.CRIMSON),
        CircleVisual(10, 10, 0, 0, 20, 0, STOCK_COLORS.WHITE),
        ShapeVisual(PLUME_2_ARR.LOD0, 255, 0)
    ],

    LOD1: [
        armoredBody(0, 255, STOCK_COLORS.WHITE, STOCK_COLORS.CRIMSON, CAPE_1_ARR.LOD1, 0, STOCK_COLORS.GOLD),
        // RectVisual(4, 15, 0, 0, 0, 0, 1, STOCK_COLORS.WHITE),
        // ShapeVisual(CAPE_1_ARR.LOD1, 255, 1, STOCK_COLORS.CRIMSON),
        CircleVisual(10, 10, 0, 0, 20, 0, STOCK_COLORS.WHITE),
        ShapeVisual(PLUME_2_ARR.LOD1, 255, 0)
    ],

    LOD2: [
        RectVisual(12, 14, -8, 0, 0, 255, 0, STOCK_COLORS.CRIMSON),
        RectVisual(4, 15, 0, 0, 0, 0, 1, STOCK_COLORS.WHITE),
        CircleVisual(10, 10, 0, 0, 20, 0, STOCK_COLORS.WHITE),
        PLUME_2_ARR.LOD2(180)
    ]
};
const VAMPIRE_3_VISUAL = {
    LOD0: [
        armoredBody(0, 255, STOCK_COLORS.WHITE, STOCK_COLORS.CRIMSON, CAPE_3_ARR.LOD0, 0, STOCK_COLORS.GOLD),
        // RectVisual(4, 15, 0, 0, 0, 0, 1, STOCK_COLORS.WHITE),
        // ShapeVisual(CAPE_3_ARR.LOD0, 255, 1, STOCK_COLORS.CRIMSON),
        CircleVisual(10, 10, 0, 0, 20, 0, STOCK_COLORS.WHITE),
        ShapeVisual(PLUME_3_ARR.LOD0, 255, 0)
    ],

    LOD1: [
        armoredBody(0, 255, STOCK_COLORS.WHITE, STOCK_COLORS.CRIMSON, CAPE_3_ARR.LOD1, 0, STOCK_COLORS.GOLD),
        // RectVisual(4, 15, 0, 0, 0, 0, 1, STOCK_COLORS.WHITE),
        // ShapeVisual(CAPE_3_ARR.LOD1, 255, 1, STOCK_COLORS.CRIMSON),
        CircleVisual(10, 10, 0, 0, 20, 0, STOCK_COLORS.WHITE),
        ShapeVisual(PLUME_3_ARR.LOD1, 255, 0)
    ],

    LOD2: [
        RectVisual(12, 14, -8, 0, 0, 255, 0, STOCK_COLORS.CRIMSON),
        RectVisual(4, 15, 0, 0, 0, 0, 1, STOCK_COLORS.WHITE),
        CircleVisual(10, 10, 0, 0, 20, 0, STOCK_COLORS.WHITE),
        PLUME_3_ARR.LOD2(255)
    ]
};
const VAMPIRE_4_VISUAL = {
    LOD0: [
        armoredBody(0, 220, STOCK_COLORS.WHITE, STOCK_COLORS.CRIMSON, CAPE_3_ARR.LOD0, 0, STOCK_COLORS.GOLD),
        // RectVisual(4, 15, 0, 0, 0, 0, 1, STOCK_COLORS.WHITE),
        // ShapeVisual(CAPE_3_ARR.LOD0, 255, 1, [220, 0, 0, 255]),
        CircleVisual(10, 10, 0, 0, 20, 0, STOCK_COLORS.WHITE),
        ShapeVisual(PLUME_4_ARR.LOD0, 255, 0)
    ],

    LOD1: [
        armoredBody(0, 220, STOCK_COLORS.WHITE, STOCK_COLORS.CRIMSON, CAPE_3_ARR.LOD1, 0, STOCK_COLORS.GOLD),
        // RectVisual(4, 15, 0, 0, 0, 0, 1, STOCK_COLORS.WHITE),
        // ShapeVisual(CAPE_3_ARR.LOD1, 255, 1, [220, 0, 0, 255]),
        CircleVisual(10, 10, 0, 0, 20, 0, STOCK_COLORS.WHITE),
        ShapeVisual(PLUME_4_ARR.LOD1, 255, 0)
    ],

    LOD2: [
        RectVisual(12, 14, -8, 0, 0, 255, 0, STOCK_COLORS.CRIMSON),
        RectVisual(4, 15, 0, 0, 0, 0, 1, STOCK_COLORS.WHITE),
        CircleVisual(10, 10, 0, 0, 20, 0, STOCK_COLORS.WHITE),
        PLUME_4_ARR.LOD2(255)
    ]
};
const VAMPIRE_5_VISUAL = {
    LOD0: [
        armoredBody(0, 220, STOCK_COLORS.WHITE, STOCK_COLORS.CRIMSON, CAPE_1_ARR.LOD0, 0, STOCK_COLORS.GOLD),
        // RectVisual(4, 15, 0, 0, 0, 0, 1, STOCK_COLORS.WHITE),
        // ShapeVisual(CAPE_1_ARR.LOD0, 255, 1, [220, 0, 0, 255]),
        CircleVisual(10, 10, 0, 0, 20, 0, STOCK_COLORS.WHITE),
        ShapeVisual(PLUME_5_ARR.LOD0, 255, 0)
    ],

    LOD1: [
        armoredBody(0, 220, STOCK_COLORS.WHITE, STOCK_COLORS.CRIMSON, CAPE_1_ARR.LOD1, 0, STOCK_COLORS.GOLD),
        // RectVisual(4, 15, 0, 0, 0, 0, 1, STOCK_COLORS.WHITE),
        // ShapeVisual(CAPE_1_ARR.LOD1, 255, 1, [220, 0, 0, 255]),
        CircleVisual(10, 10, 0, 0, 20, 0, STOCK_COLORS.WHITE),
        ShapeVisual(PLUME_5_ARR.LOD1, 255, 0)
    ],

    LOD2: [
        RectVisual(12, 14, -8, 0, 0, 255, 0, STOCK_COLORS.CRIMSON),
        RectVisual(4, 15, 0, 0, 0, 0, 1, STOCK_COLORS.WHITE),
        CircleVisual(10, 10, 0, 0, 20, 0, STOCK_COLORS.WHITE),
        PLUME_5_ARR.LOD2(255)
    ]
};
const VAMPIRE_6_VISUAL = {
    LOD0: [
        armoredBody(0, 220, STOCK_COLORS.WHITE, STOCK_COLORS.CRIMSON, CAPE_2_ARR.LOD0, 0, STOCK_COLORS.GOLD),
        // RectVisual(4, 15, 0, 0, 0, 0, 1, STOCK_COLORS.WHITE),
        // ShapeVisual(CAPE_2_ARR.LOD0, 255, 1, [220, 0, 0, 255]),
        CircleVisual(10, 10, 0, 0, 20, 0, STOCK_COLORS.WHITE),
        ShapeVisual(PLUME_6_ARR.LOD0, 255, 0)
    ],

    LOD1: [
        RectVisual(4, 15, 0, 0, 0, 0, 1, STOCK_COLORS.WHITE),
        RectVisual(9, 16, -4.5, 0, 0, 255, 0, STOCK_COLORS.CRIMSON),
        CircleVisual(10, 10, 0, 0, 20, 0, STOCK_COLORS.WHITE),
        ShapeVisual(PLUME_6_ARR.LOD1, 255, 0)
    ],

    LOD2: [
        RectVisual(12, 14, -8, 0, 0, 255, 0, STOCK_COLORS.CRIMSON),
        RectVisual(4, 15, 0, 0, 0, 0, 1, STOCK_COLORS.WHITE),
        CircleVisual(10, 10, 0, 0, 20, 0, STOCK_COLORS.WHITE),
        PLUME_6_ARR.LOD2(255)
    ]
};
const VAMPIRE_7_VISUAL = {
    LOD0: [
        armoredBody(0, 220, STOCK_COLORS.WHITE, STOCK_COLORS.CRIMSON, CAPE_ARR.LOD0, 0, STOCK_COLORS.GOLD),
        // RectVisual(4, 15, 0, 0, 0, 0, 1, STOCK_COLORS.WHITE),
        // ShapeVisual(CAPE_ARR.LOD0, 255, 1, [220, 0, 0, 255]),
        CircleVisual(10, 10, 0, 0, 20, 0, STOCK_COLORS.WHITE),
        ShapeVisual(PLUME_7_ARR.LOD0, 255, 0)
    ],

    LOD1: [
        armoredBody(0, 220, STOCK_COLORS.WHITE, STOCK_COLORS.CRIMSON, CAPE_ARR.LOD1, 0, STOCK_COLORS.GOLD),
        // RectVisual(4, 15, 0, 0, 0, 0, 1, STOCK_COLORS.WHITE),
        // ShapeVisual(CAPE_ARR.LOD1, 255, 1, [220, 0, 0, 255]),
        CircleVisual(10, 10, 0, 0, 20, 0, STOCK_COLORS.WHITE),
        ShapeVisual(PLUME_7_ARR.LOD1, 255, 0)
    ],

    LOD2: [
        RectVisual(12, 14, -8, 0, 0, 255, 0, STOCK_COLORS.CRIMSON),
        RectVisual(4, 15, 0, 0, 0, 0, 1, STOCK_COLORS.WHITE),
        CircleVisual(10, 10, 0, 0, 20, 0, STOCK_COLORS.WHITE),
        PLUME_7_ARR.LOD2(255)
    ]
};
const VAMPIRE_8_VISUAL = {
    LOD0: [
        armoredBody(0, 240, STOCK_COLORS.WHITE, STOCK_COLORS.CRIMSON, CAPE_1_ARR.LOD0, 0, STOCK_COLORS.GOLD),
        // RectVisual(4, 15, 0, 0, 0, 0, 1, STOCK_COLORS.WHITE),
        // ShapeVisual(CAPE_1_ARR.LOD0, 255, 1, [180, 0, 0, 255]),
        CircleVisual(10, 10, 0, 0, 20, 0, STOCK_COLORS.WHITE),
        ShapeVisual(PLUME_8_ARR.LOD0, 255, 0)
    ],

    LOD1: [
        armoredBody(0, 240, STOCK_COLORS.WHITE, STOCK_COLORS.CRIMSON, CAPE_1_ARR.LOD1, 0, STOCK_COLORS.GOLD),
        // RectVisual(4, 15, 0, 0, 0, 0, 1, STOCK_COLORS.WHITE),
        // ShapeVisual(CAPE_1_ARR.LOD1, 255, 1, [180, 0, 0, 255]),
        CircleVisual(10, 10, 0, 0, 20, 0, STOCK_COLORS.WHITE),
        ShapeVisual(PLUME_8_ARR.LOD1, 255, 0)
    ],

    LOD2: [
        RectVisual(12, 14, -8, 0, 0, 255, 0, STOCK_COLORS.CRIMSON),
        RectVisual(4, 15, 0, 0, 0, 0, 1, STOCK_COLORS.WHITE),
        CircleVisual(10, 10, 0, 0, 20, 0, STOCK_COLORS.WHITE),
        PLUME_8_ARR.LOD2(255)
    ]
};
const VAMPIRE_9_VISUAL = {
    LOD0: [
        armoredBody(0, 240, STOCK_COLORS.WHITE, STOCK_COLORS.CRIMSON, CAPE_2_ARR.LOD0, 0, STOCK_COLORS.GOLD),
        // RectVisual(4, 15, 0, 0, 0, 0, 1, STOCK_COLORS.WHITE),
        // ShapeVisual(CAPE_2_ARR.LOD0, 255, 1, [180, 0, 0, 255]),
        CircleVisual(10, 10, 0, 0, 20, 0, STOCK_COLORS.WHITE),
        ShapeVisual(PLUME_9_ARR.LOD0, 255, 0)
    ],

    LOD1: [
        RectVisual(4, 15, 0, 0, 0, 0, 1, STOCK_COLORS.WHITE),
        RectVisual(9, 16, -4.5, 0, 0, 255, 0, STOCK_COLORS.CRIMSON),
        CircleVisual(10, 10, 0, 0, 20, 0, STOCK_COLORS.WHITE),
        ShapeVisual(PLUME_9_ARR.LOD1, 255, 0)
    ],

    LOD2: [
        RectVisual(12, 14, -8, 0, 0, 255, 0, STOCK_COLORS.CRIMSON),
        RectVisual(4, 15, 0, 0, 0, 0, 1, STOCK_COLORS.WHITE),
        CircleVisual(10, 10, 0, 0, 20, 0, STOCK_COLORS.WHITE),
        PLUME_9_ARR.LOD2(255)
    ]
};

const KNIGHT_VISUAL = {
    LOD0: [
        RectVisual(15, 60, -5, 0, 0, 150, 0, STOCK_COLORS.WHITE),
        RectVisual(40, 30, 0, 0, 0, 190, 0),
        RectVisual(25, 20, 7.5, 0, 0, 190, 0, STOCK_COLORS.WHITE),
        ShapeVisual([
            { x: 20, y: 20, curve: false },
            { x: -20, y: 20, curve: false },
            { x: -20, y: 30, curve: false },
            { x: 10, y: 30, curve: false },
            { x: 20, y: 25, curve: false },
        ], 190, 0),
        ShapeVisual([
            { x: 20, y: -20, curve: false },
            { x: -20, y: -20, curve: false },
            { x: -20, y: -30, curve: false },
            { x: 10, y: -30, curve: false },
            { x: 20, y: -25, curve: false },
        ], 190, 0)
    ],
    LOD1: [
        RectVisual(15, 60, -5, 0, 0, 150, 0, STOCK_COLORS.WHITE),
        RectVisual(40, 30, 0, 0, 0, 190, 0),
        RectVisual(25, 20, 7.5, 0, 0, 190, 0, STOCK_COLORS.WHITE),
        RectVisual(40, 10, 0, -25, 0, 190, 0),
        RectVisual(40, 10, 0, 25, 0, 190, 0)
    ],
    LOD2: [
        RectVisual(15, 60, -5, 0, 0, 150, 0, STOCK_COLORS.WHITE),
        RectVisual(40, 30, 0, 0, 0, 190, 0),
        RectVisual(25, 20, 7.5, 0, 0, 190, 0, STOCK_COLORS.WHITE),
        RectVisual(40, 10, 0, -25, 0, 190, 0),
        RectVisual(40, 10, 0, 25, 0, 190, 0)
    ]
};

const CRUSADER_VISUAL = {
    LOD0: [
        new Visual(function (x, y, cols, timeElapsed = 0) {
            push();
            translate(x, y);
            strokeWeight(0);
            fill(150);
            const shaded1 = cols.map(col => col * 190 / 255);
            rectMode(CENTER);
            rect(-5, 0, 15, 60);
            fill(...shaded1);
            arc(-5, -22.5, 30, 35, PI, 0);
            arc(-5, 22.5, 30, 35, 0, PI);
            rect(-12.5, 0, 20, 35);
            arc(-3, 0, 40, 35, PI + HALF_PI, HALF_PI);
            arc(-22, 0, 5, 35, HALF_PI, PI + HALF_PI);
            fill(190);
            arc(14.5, 0, 5, 15, PI + HALF_PI, HALF_PI);
            rect(5, 0, 20, 15);
            scale(-1, 1);
            arc(4.5, 0, 10, 15, PI + HALF_PI, HALF_PI);
            pop();
        }, 255)
    ],
    LOD1: [
        new Visual(function (x, y, cols, timeElapsed = 0) {
            push();
            translate(x, y);
            strokeWeight(0);
            fill(150);
            const shaded1 = cols.map(col => col * 190 / 255);
            rectMode(CENTER);
            rect(-5, 0, 15, 60);
            fill(...shaded1);
            arc(-5, -22.5, 30, 35, PI, 0);
            arc(-5, 22.5, 30, 35, 0, PI);
            rect(-12.5, 0, 20, 35);
            arc(-3, 0, 40, 35, PI + HALF_PI, HALF_PI);
            fill(190);
            arc(14.5, 0, 5, 15, PI + HALF_PI, HALF_PI);
            rect(5, 0, 20, 15);
            scale(-1, 1);
            arc(4.5, 0, 10, 15, PI + HALF_PI, HALF_PI);
            pop();
        }, 255)
    ],
    LOD2: [
        new Visual(function (x, y, cols, timeElapsed = 0) {
            push();
            translate(x, y);
            strokeWeight(0);
            fill(150);
            const shaded1 = cols.map(col => col * 190 / 255);
            rectMode(CENTER);
            rect(-5, 0, 15, 60);
            fill(...shaded1);
            arc(-5, -22.5, 30, 35, PI, 0);
            arc(-5, 22.5, 30, 35, 0, PI);
            rect(-12.5, 0, 20, 35);
            arc(-3, 0, 40, 35, PI + HALF_PI, HALF_PI);
            fill(190);
            arc(14.5, 0, 5, 15, PI + HALF_PI, HALF_PI);
            rect(5, 0, 20, 15);
            pop();
        }, 255)
    ]
};

const BATTLESHIP_VISUAL = {
    LOD0: [
        ShapeVisual([
            { x: 190, y: -5, curve: false },
            { x: 200, y: -10, curve: false },
            { x: 200, y: -30, curve: false },
            { x: 180, y: -40, curve: false },
            { x: 0, y: -40, curve: false },
            { x: -40, y: -60, curve: false },
            { x: -80, y: -60, curve: false },
            { x: -100, y: -40, curve: false },
            { x: -120, y: -40, curve: false },
            { x: -140, y: -60, curve: false },
            { x: -190, y: -60, curve: false },
            { x: -200, y: -20, curve: false },
            { x: -200, y: 20, curve: false },
            { x: -190, y: 60, curve: false },
            { x: -140, y: 60, curve: false },
            { x: -120, y: 40, curve: false },
            { x: -100, y: 40, curve: false },
            { x: -80, y: 60, curve: false },
            { x: -40, y: 60, curve: false },
            { x: 0, y: 40, curve: false },
            { x: 180, y: 40, curve: false },
            { x: 200, y: 30, curve: false },
            { x: 200, y: 10, curve: false },
            { x: 190, y: 5, curve: false },
        ], 130, 0, STOCK_COLORS.WHITE),
        ShapeVisual([
            { x: 145, y: 15, curve: false },
            { x: 150, y: 10, curve: false },
            { x: 150, y: -10, curve: false },
            { x: 145, y: -15, curve: false },
            { x: -40, y: -15, curve: false },
            { x: -45, y: -20, curve: false },
            { x: -45, y: -30, curve: false },
            { x: -50, y: -35, curve: false },
            { x: -80, y: -35, curve: false },
            { x: -85, y: -30, curve: false },
            { x: -85, y: 30, curve: false },
            { x: -80, y: 35, curve: false },
            { x: -50, y: 35, curve: false },
            { x: -45, y: 30, curve: false },
            { x: -45, y: 20, curve: false },
            { x: -40, y: 15, curve: false }
        ], 110, 0, STOCK_COLORS.WHITE),
        ShapeVisual([
            { x: -60, y: 55, curve: false },
            { x: -55, y: 50, curve: false },
            { x: -55, y: -50, curve: false },
            { x: -60, y: -55, curve: false },
            { x: -70, y: -55, curve: false },
            { x: -75, y: -50, curve: false },
            { x: -75, y: 50, curve: false },
            { x: -70, y: 55, curve: false },
        ], 190, 0, STOCK_COLORS.WHITE)
    ],
    LOD1: [
        ShapeVisual([
            { x: 190, y: -5, curve: false },
            { x: 200, y: -10, curve: false },
            { x: 200, y: -30, curve: false },
            { x: 180, y: -40, curve: false },
            { x: 0, y: -40, curve: false },
            { x: -40, y: -60, curve: false },
            { x: -80, y: -60, curve: false },
            { x: -100, y: -40, curve: false },
            { x: -120, y: -40, curve: false },
            { x: -140, y: -60, curve: false },
            { x: -190, y: -60, curve: false },
            { x: -200, y: -20, curve: false },
            { x: -200, y: 20, curve: false },
            { x: -190, y: 60, curve: false },
            { x: -140, y: 60, curve: false },
            { x: -120, y: 40, curve: false },
            { x: -100, y: 40, curve: false },
            { x: -80, y: 60, curve: false },
            { x: -40, y: 60, curve: false },
            { x: 0, y: 40, curve: false },
            { x: 180, y: 40, curve: false },
            { x: 200, y: 30, curve: false },
            { x: 200, y: 10, curve: false },
            { x: 190, y: 5, curve: false },
        ], 130, 0, STOCK_COLORS.WHITE),
        ShapeVisual([
            { x: 145, y: 15, curve: false },
            { x: 150, y: 10, curve: false },
            { x: 150, y: -10, curve: false },
            { x: 145, y: -15, curve: false },
            { x: -40, y: -15, curve: false },
            { x: -45, y: -20, curve: false },
            { x: -45, y: -30, curve: false },
            { x: -50, y: -35, curve: false },
            { x: -80, y: -35, curve: false },
            { x: -85, y: -30, curve: false },
            { x: -85, y: 30, curve: false },
            { x: -80, y: 35, curve: false },
            { x: -50, y: 35, curve: false },
            { x: -45, y: 30, curve: false },
            { x: -45, y: 20, curve: false },
            { x: -40, y: 15, curve: false }
        ], 110, 0, STOCK_COLORS.WHITE),
        ShapeVisual([
            { x: -60, y: 55, curve: false },
            { x: -55, y: 50, curve: false },
            { x: -55, y: -50, curve: false },
            { x: -60, y: -55, curve: false },
            { x: -70, y: -55, curve: false },
            { x: -75, y: -50, curve: false },
            { x: -75, y: 50, curve: false },
            { x: -70, y: 55, curve: false },
        ], 190, 0, STOCK_COLORS.WHITE)
    ],
    LOD2: [
        ShapeVisual([
            { x: 190, y: -5, curve: false },
            { x: 200, y: -10, curve: false },
            { x: 200, y: -30, curve: false },
            { x: 180, y: -40, curve: false },
            { x: 0, y: -40, curve: false },
            { x: -40, y: -60, curve: false },
            { x: -80, y: -60, curve: false },
            { x: -100, y: -40, curve: false },
            { x: -120, y: -40, curve: false },
            { x: -140, y: -60, curve: false },
            { x: -190, y: -60, curve: false },
            { x: -200, y: -20, curve: false },
            { x: -200, y: 20, curve: false },
            { x: -190, y: 60, curve: false },
            { x: -140, y: 60, curve: false },
            { x: -120, y: 40, curve: false },
            { x: -100, y: 40, curve: false },
            { x: -80, y: 60, curve: false },
            { x: -40, y: 60, curve: false },
            { x: 0, y: 40, curve: false },
            { x: 180, y: 40, curve: false },
            { x: 200, y: 30, curve: false },
            { x: 200, y: 10, curve: false },
            { x: 190, y: 5, curve: false },
        ], 130, 0, STOCK_COLORS.WHITE),
        ShapeVisual([
            { x: 145, y: 15, curve: false },
            { x: 150, y: 10, curve: false },
            { x: 150, y: -10, curve: false },
            { x: 145, y: -15, curve: false },
            { x: -40, y: -15, curve: false },
            { x: -45, y: -20, curve: false },
            { x: -45, y: -30, curve: false },
            { x: -50, y: -35, curve: false },
            { x: -80, y: -35, curve: false },
            { x: -85, y: -30, curve: false },
            { x: -85, y: 30, curve: false },
            { x: -80, y: 35, curve: false },
            { x: -50, y: 35, curve: false },
            { x: -45, y: 30, curve: false },
            { x: -45, y: 20, curve: false },
            { x: -40, y: 15, curve: false }
        ], 110, 0, STOCK_COLORS.WHITE),
        ShapeVisual([
            { x: -60, y: 55, curve: false },
            { x: -55, y: 50, curve: false },
            { x: -55, y: -50, curve: false },
            { x: -60, y: -55, curve: false },
            { x: -70, y: -55, curve: false },
            { x: -75, y: -50, curve: false },
            { x: -75, y: 50, curve: false },
            { x: -70, y: 55, curve: false },
        ], 190, 0, STOCK_COLORS.WHITE)
    ]
};

const DESTROYER_VISUAL = {
    LOD0: [
        ShapeVisual([
            { x: 100, y: 0, curve: false },
            { x: -40, y: 25, curve: false },
            { x: -45, y: 30, curve: false },
            { x: -60, y: 30, curve: false },
            { x: -70, y: 80, curve: false },
            { x: -80, y: 80, curve: false },
            { x: -105, y: 0, curve: false },
            { x: -80, y: -80, curve: false },
            { x: -70, y: -80, curve: false },
            { x: -60, y: -30, curve: false },
            { x: -45, y: -30, curve: false },
            { x: -40, y: -25, curve: false },
        ], 130, 0, STOCK_COLORS.WHITE)
    ],
    LOD1: [
        ShapeVisual([
            { x: 100, y: 0, curve: false },
            { x: -40, y: 25, curve: false },
            { x: -45, y: 30, curve: false },
            { x: -60, y: 30, curve: false },
            { x: -70, y: 80, curve: false },
            { x: -80, y: 80, curve: false },
            { x: -105, y: 0, curve: false },
            { x: -80, y: -80, curve: false },
            { x: -70, y: -80, curve: false },
            { x: -60, y: -30, curve: false },
            { x: -45, y: -30, curve: false },
            { x: -40, y: -25, curve: false },
        ], 130, 0, STOCK_COLORS.WHITE)
    ],
    LOD2: [
        ShapeVisual([
            { x: 100, y: 0, curve: false },
            { x: -40, y: 25, curve: false },
            { x: -45, y: 30, curve: false },
            { x: -60, y: 30, curve: false },
            { x: -70, y: 80, curve: false },
            { x: -80, y: 80, curve: false },
            { x: -105, y: 0, curve: false },
            { x: -80, y: -80, curve: false },
            { x: -70, y: -80, curve: false },
            { x: -60, y: -30, curve: false },
            { x: -45, y: -30, curve: false },
            { x: -40, y: -25, curve: false },
        ], 130, 0, STOCK_COLORS.WHITE)
    ]
};

// MONSTERS
const SPIDER_VISUAL = {
    LOD0: [
        new Visual(function (x, y, cols, timeElapsed = 0) {
            push();
            translate(x + 2, y);
            stroke(90);
            fill(50);

            strokeWeight(1.5);
            line(0, 0, 6, 3.6);
            line(6, 3.6, 8, 7.6);
            strokeWeight(1);
            line(8, 7.6, 9, 11.6);

            strokeWeight(1.5);
            line(0, 0, 6, -3.6);
            line(6, -3.6, 8, -7.6);
            strokeWeight(1);
            line(8, -7.6, 9, -11.6);

            strokeWeight(2);
            line(0, 0, -5, -5);
            strokeWeight(1.5);
            line(-5, -5, -8, -6.2);
            strokeWeight(1);
            line(-8, -6.2, -12, -6.6);

            strokeWeight(2);
            line(0, 0, -5, 5);
            strokeWeight(1.5);
            line(-5, 5, -8, 6.2);
            strokeWeight(1);
            line(-8, 6.2, -12, 6.6);

            stroke(70);
            strokeWeight(1);
            line(0, 0, 2.75, 5);
            strokeWeight(0.75);
            line(2.75, 5, 3.5, 10);

            strokeWeight(1);
            line(0, 0, 2.75, -5);
            strokeWeight(0.75);
            line(2.75, -5, 3.5, -10);

            strokeWeight(1);
            line(0, 0, -2.75, 5);
            strokeWeight(0.75);
            line(-2.75, 5, -3.5, 10);

            strokeWeight(1);
            line(0, 0, -2.75, -5);
            strokeWeight(0.75);
            line(-2.75, -5, -3.5, -10);

            strokeWeight(0);
            ellipse(0, 0, 8, 6);
            ellipse(-8, 0, 10, 8);

            pop();
        }, 255)
    ],
    LOD1: [
        new Visual(function (x, y, cols, timeElapsed = 0) {
            push();
            translate(x + 2, y);
            stroke(90);
            fill(50);

            strokeWeight(1.5);
            line(0, 0, 9, 11.6);

            strokeWeight(1.5);
            line(0, 0, 9, -11.6);

            strokeWeight(1.5);
            line(0, 0, -12, -6.6);

            strokeWeight(1.5);
            line(0, 0, -12, 6.6);

            stroke(70);
            strokeWeight(1);
            line(0, 0, 3.5, 10);
            line(0, 0, 3.5, -10);
            line(0, 0, -3.5, 10);
            line(0, 0, -3.5, -10);

            strokeWeight(0);
            ellipse(0, 0, 8, 6);
            ellipse(-8, 0, 10, 8);

            pop();
        }, 255)
    ],
    LOD2: [
        new Visual(function (x, y, cols, timeElapsed = 0) {
            push();
            translate(x + 2, y);
            stroke(90);
            fill(50);

            strokeWeight(1.5);
            line(0, 0, 9, 11.6);
            line(0, 0, 9, -11.6);
            line(0, 0, -12, -6.6);
            line(0, 0, -12, 6.6);

            stroke(70);
            strokeWeight(1);
            line(0, 0, 3.5, 10);
            line(0, 0, 3.5, -10);
            line(0, 0, -3.5, 10);
            line(0, 0, -3.5, -10);

            strokeWeight(0);
            ellipse(-4.5, 0, 17, 7);

            pop();
        }, 255)
    ]
};

const TROLL_VISUAL = {
    LOD0: [
        RectVisual(8, 30, 0, 0, 0, 255, 0, [51, 58, 0, 255]),
        TriangleVisual(6, 6, 15, 4.5, 6, 3, 255, 0, STOCK_COLORS.BONE),
        TriangleVisual(6, -6, 15, -4.5, 6, -3, 255, 0, STOCK_COLORS.BONE),
        CircleVisual(20, 20, 0, 0, 255, 0, [63, 73, 0, 255])
    ],
    LOD1: [
        RectVisual(8, 30, 0, 0, 0, 255, 0, [51, 58, 0, 255]),
        TriangleVisual(6, 6, 15, 4.5, 6, 3, 255, 0, STOCK_COLORS.BONE),
        TriangleVisual(6, -6, 15, -4.5, 6, -3, 255, 0, STOCK_COLORS.BONE),
        CircleVisual(20, 20, 0, 0, 255, 0, [63, 73, 0, 255])
    ],
    LOD2: [
        RectVisual(8, 30, 0, 0, 0, 255, 0, [51, 58, 0, 255]),
        TriangleVisual(6, 6, 15, 4.5, 6, 3, 255, 0, STOCK_COLORS.BONE),
        TriangleVisual(6, -6, 15, -4.5, 6, -3, 255, 0, STOCK_COLORS.BONE),
        CircleVisual(20, 20, 0, 0, 255, 0, [63, 73, 0, 255])
    ]
};
const TROLL_1_VISUAL = {
    LOD0: [
        RectVisual(8, 30, 0, 0, 0, 255, 0, [1, 78, 46, 255]),
        ShapeVisual([
            { x: 6, y: 6, curve: false },
            { x: 6, y: 3, curve: false },
            { x: 13, y: 3.5, curve: false },
            { x: 12, y: 4.5, curve: false },
        ], 255, 0, STOCK_COLORS.BONE),
        TriangleVisual(6, -6, 15, -4.5, 6, -3, 255, 0, STOCK_COLORS.BONE),
        CircleVisual(20, 20, 0, 0, 255, 0, [21, 105, 70, 255])
    ],
    LOD1: [
        RectVisual(8, 30, 0, 0, 0, 255, 0, [1, 78, 46, 255]),
        ShapeVisual([
            { x: 6, y: 6, curve: false },
            { x: 6, y: 3, curve: false },
            { x: 13, y: 3.5, curve: false },
            { x: 12, y: 4.5, curve: false },
        ], 255, 0, STOCK_COLORS.BONE),
        TriangleVisual(6, -6, 15, -4.5, 6, -3, 255, 0, STOCK_COLORS.BONE),
        CircleVisual(20, 20, 0, 0, 255, 0, [21, 105, 70, 255])
    ],
    LOD2: [
        RectVisual(8, 30, 0, 0, 0, 255, 0, [1, 78, 46, 255]),
        ShapeVisual([
            { x: 6, y: 6, curve: false },
            { x: 6, y: 3, curve: false },
            { x: 13, y: 3.5, curve: false },
            { x: 12, y: 4.5, curve: false },
        ], 255, 0, STOCK_COLORS.BONE),
        TriangleVisual(6, -6, 15, -4.5, 6, -3, 255, 0, STOCK_COLORS.BONE),
        CircleVisual(20, 20, 0, 0, 255, 0, [21, 105, 70, 255])
    ]
};
const TROLL_2_VISUAL = {
    LOD0: [
        RectVisual(8, 30, 0, 0, 0, 255, 0, [82, 88, 44, 255]),
        ShapeVisual([
            { x: 6, y: -6, curve: false },
            { x: 6, y: -3, curve: false },
            { x: 13, y: -3.5, curve: false },
            { x: 12, y: -4.5, curve: false },
        ], 255, 0, STOCK_COLORS.BONE),
        TriangleVisual(6, 6, 15, 4.5, 6, 3, 255, 0, STOCK_COLORS.BONE),
        CircleVisual(20, 20, 0, 0, 255, 0, [87, 95, 36, 255])
    ],
    LOD1: [
        RectVisual(8, 30, 0, 0, 0, 255, 0, [82, 88, 44, 255]),
        ShapeVisual([
            { x: 6, y: -6, curve: false },
            { x: 6, y: -3, curve: false },
            { x: 13, y: -3.5, curve: false },
            { x: 12, y: -4.5, curve: false },
        ], 255, 0, STOCK_COLORS.BONE),
        TriangleVisual(6, 6, 15, 4.5, 6, 3, 255, 0, STOCK_COLORS.BONE),
        CircleVisual(20, 20, 0, 0, 255, 0, [87, 95, 36, 255])
    ],
    LOD2: [
        RectVisual(8, 30, 0, 0, 0, 255, 0, [82, 88, 44, 255]),
        ShapeVisual([
            { x: 6, y: -6, curve: false },
            { x: 6, y: -3, curve: false },
            { x: 13, y: -3.5, curve: false },
            { x: 12, y: -4.5, curve: false },
        ], 255, 0, STOCK_COLORS.BONE),
        TriangleVisual(6, 6, 15, 4.5, 6, 3, 255, 0, STOCK_COLORS.BONE),
        CircleVisual(20, 20, 0, 0, 255, 0, [87, 95, 36, 255])
    ]
};
const TROLL_3_VISUAL = {
    LOD0: [
        RectVisual(8, 30, 0, 0, 0, 255, 0, [51, 58, 0, 255]),
        TriangleVisual(4, 5, 15, 8, 6, 3, 255, 0, STOCK_COLORS.BONE),
        TriangleVisual(4, -5, 15, -8, 6, -3, 255, 0, STOCK_COLORS.BONE),
        CircleVisual(20, 20, 0, 0, 255, 0, [63, 73, 0, 255])
    ],
    LOD1: [
        RectVisual(8, 30, 0, 0, 0, 255, 0, [51, 58, 0, 255]),
        TriangleVisual(4, 5, 15, 8, 6, 3, 255, 0, STOCK_COLORS.BONE),
        TriangleVisual(4, -5, 15, -8, 6, -3, 255, 0, STOCK_COLORS.BONE),
        CircleVisual(20, 20, 0, 0, 255, 0, [63, 73, 0, 255])
    ],
    LOD2: [
        RectVisual(8, 30, 0, 0, 0, 255, 0, [51, 58, 0, 255]),
        TriangleVisual(4, 5, 15, 8, 6, 3, 255, 0, STOCK_COLORS.BONE),
        TriangleVisual(4, -5, 15, -8, 6, -3, 255, 0, STOCK_COLORS.BONE),
        CircleVisual(20, 20, 0, 0, 255, 0, [63, 73, 0, 255])
    ]
};
const TROLL_4_VISUAL = {
    LOD0: [
        RectVisual(8, 30, 0, 0, 0, 255, 0, [1, 78, 46, 255]),
        TriangleVisual(6, 6, 15, 6, 6, 3, 255, 0, STOCK_COLORS.BONE),
        TriangleVisual(6, -6, 15, -6, 6, -3, 255, 0, STOCK_COLORS.BONE),
        CircleVisual(20, 20, 0, 0, 255, 0, [21, 105, 70, 255])
    ],
    LOD1: [
        RectVisual(8, 30, 0, 0, 0, 255, 0, [1, 78, 46, 255]),
        TriangleVisual(6, 6, 15, 6, 6, 3, 255, 0, STOCK_COLORS.BONE),
        TriangleVisual(6, -6, 15, -6, 6, -3, 255, 0, STOCK_COLORS.BONE),
        CircleVisual(20, 20, 0, 0, 255, 0, [21, 105, 70, 255])
    ],
    LOD2: [
        RectVisual(8, 30, 0, 0, 0, 255, 0, [1, 78, 46, 255]),
        TriangleVisual(6, 6, 15, 6, 6, 3, 255, 0, STOCK_COLORS.BONE),
        TriangleVisual(6, -6, 15, -6, 6, -3, 255, 0, STOCK_COLORS.BONE),
        CircleVisual(20, 20, 0, 0, 255, 0, [21, 105, 70, 255])
    ]
};
const TROLL_5_VISUAL = {
    LOD0: [
        RectVisual(8, 30, 0, 0, 0, 255, 0, [82, 88, 44, 255]),
        TriangleVisual(6, 6, 15, 6, 6, 6, 255, 0, STOCK_COLORS.BONE),
        TriangleVisual(6, -6, 15, -6, 6, -6, 255, 0, STOCK_COLORS.BONE),
        CircleVisual(20, 20, 0, 0, 255, 0, [87, 95, 36, 255])
    ],
    LOD1: [
        RectVisual(8, 30, 0, 0, 0, 255, 0, [82, 88, 44, 255]),
        TriangleVisual(6, 6, 15, 6, 6, 6, 255, 0, STOCK_COLORS.BONE),
        TriangleVisual(6, -6, 15, -6, 6, -6, 255, 0, STOCK_COLORS.BONE),
        CircleVisual(20, 20, 0, 0, 255, 0, [87, 95, 36, 255])
    ],
    LOD2: [
        RectVisual(8, 30, 0, 0, 0, 255, 0, [82, 88, 44, 255]),
        TriangleVisual(6, 6, 15, 6, 6, 6, 255, 0, STOCK_COLORS.BONE),
        TriangleVisual(6, -6, 15, -6, 6, -6, 255, 0, STOCK_COLORS.BONE),
        CircleVisual(20, 20, 0, 0, 255, 0, [87, 95, 36, 255])
    ]
};
const TROLL_AXE = {
    LOD0: [
        ShapeVisual([
            { x: 26.7, y: 0, curve: true },
            { x: 28, y: 6.7, curve: true },
            { x: 33.3, y: 10, curve: true },
            { x: 33.3, y: 10, curve: false },
            { x: 33.3, y: 10, curve: true },
            { x: 23.3, y: 11.25, curve: true },
            { x: 13.3, y: 10, curve: true },
            { x: 13.3, y: 10, curve: false },
            { x: 13.3, y: 10, curve: true },
            { x: 18.7, y: 5, curve: true },
            { x: 20, y: 0, curve: true },
            { x: 18.7, y: -5, curve: true },
            { x: 13.3, y: -10, curve: true },
            { x: 13.3, y: -10, curve: false },
            { x: 13.3, y: -10, curve: true },
            { x: 23.3, y: -11.25, curve: true },
            { x: 33.3, y: -10, curve: true },
            { x: 33.3, y: -10, curve: false },
            { x: 33.3, y: -10, curve: true },
            { x: 28, y: -5, curve: true },
        ], 150, 0, STOCK_COLORS.WHITE),
        RectVisual(30, 2, 15, 0, 0, 220, 0, STOCK_COLORS.WOOD)
    ],
    LOD1: [
        ShapeVisual([
            { x: 26.7, y: 0, curve: true },
            { x: 28, y: 6.7, curve: true },
            { x: 33.3, y: 10, curve: true },
            { x: 33.3, y: 10, curve: false },
            { x: 33.3, y: 10, curve: true },
            { x: 23.3, y: 11.25, curve: true },
            { x: 13.3, y: 10, curve: true },
            { x: 13.3, y: 10, curve: false },
            { x: 13.3, y: 10, curve: true },
            { x: 18.7, y: 5, curve: true },
            { x: 20, y: 0, curve: true },
            { x: 18.7, y: -5, curve: true },
            { x: 13.3, y: -10, curve: true },
            { x: 13.3, y: -10, curve: false },
            { x: 13.3, y: -10, curve: true },
            { x: 23.3, y: -11.25, curve: true },
            { x: 33.3, y: -10, curve: true },
            { x: 33.3, y: -10, curve: false },
            { x: 33.3, y: -10, curve: true },
            { x: 28, y: -5, curve: true },
        ], 150, 0, STOCK_COLORS.WHITE),
        RectVisual(30, 2, 15, 0, 0, 220, 0, STOCK_COLORS.WOOD)
    ],
    LOD2: [
        ShapeVisual([
            { x: 26.7, y: 0, curve: true },
            { x: 28, y: 5, curve: true },
            { x: 33.3, y: 10, curve: false },
            { x: 33.3, y: 10, curve: true },
            { x: 23.3, y: 11.25, curve: true },
            { x: 13.3, y: 10, curve: true },
            { x: 13.3, y: 10, curve: false },
            { x: 18.7, y: 5, curve: true },
            { x: 20, y: 0, curve: true },
            { x: 18.7, y: -5, curve: true },
            { x: 13.3, y: -10, curve: false },
            { x: 13.3, y: -10, curve: true },
            { x: 23.3, y: -11.25, curve: true },
            { x: 33.3, y: -10, curve: true },
            { x: 33.3, y: -10, curve: false },
            { x: 28, y: -5, curve: true },
        ], 150, 0, STOCK_COLORS.WHITE),
        RectVisual(30, 2, 15, 0, 0, 220, 0, STOCK_COLORS.WOOD)
    ]
};

const GIANT_VISUAL = {
    LOD0: [
        RectVisual(40, 160, 0, 0, 0, 255, 0, [115, 64, 28, 255]),
        CircleVisual(80, 80, 0, 0, 220, 0, STOCK_COLORS.WHITE)
    ],
    LOD1: [
        RectVisual(40, 160, 0, 0, 0, 255, 0, [115, 64, 28, 255]),
        CircleVisual(80, 80, 0, 0, 220, 0, STOCK_COLORS.WHITE)
    ],
    LOD2: [
        RectVisual(40, 160, 0, 0, 0, 255, 0, [115, 64, 28, 255]),
        CircleVisual(80, 80, 0, 0, 220, 0, STOCK_COLORS.WHITE)
    ]
};

const GIANT_CLUB_VISUAL = {
    LOD0: [
        LineVisual([
            { x: 0, y: 0, curve: false },
            { x: 40, y: -6, curve: false },
            { x: 65, y: 3, curve: false },
            { x: 120, y: 0, curve: false }
        ], 200, 10, STOCK_COLORS.WOOD),
        ShapeVisual([
            { x: 150, y: 0, curve: false },
            { x: 160, y: 40, curve: false },
            { x: 150, y: 40, curve: false },
            { x: 130, y: 35, curve: false },
            { x: 110, y: 40, curve: false },
            { x: 115, y: 10, curve: false },
            { x: 120, y: 0, curve: false },
            { x: 110, y: -40, curve: false },
            { x: 130, y: -50, curve: false },
            { x: 150, y: -35, curve: false },
            { x: 160, y: -40, curve: false },
        ], 110, 0, STOCK_COLORS.WHITE)
    ],
    LOD1: [
        LineVisual([
            { x: 0, y: 0, curve: false },
            { x: 40, y: -6, curve: false },
            { x: 65, y: 3, curve: false },
            { x: 120, y: 0, curve: false }
        ], 200, 10, STOCK_COLORS.WOOD),
        RectVisual(40, 80, 140, 0, 0, 110, 0, STOCK_COLORS.WHITE)
    ],
    LOD2: [
        LineVisual([
            { x: 0, y: 0, curve: false },
            { x: 40, y: -6, curve: false },
            { x: 65, y: 3, curve: false },
            { x: 120, y: 0, curve: false }
        ], 200, 10, STOCK_COLORS.WOOD),
        RectVisual(40, 80, 140, 0, 0, 110, 0, STOCK_COLORS.WHITE)
    ]
};
// WEAPONS
const FLAMETHROWER_VISUAL = {
    LOD0: [
        CircleVisual(5, 5, 8, 0, 180, 0, STOCK_COLORS.WHITE),
        RectVisual(16, 2.5, 8, 0, 0, 200, 0, STOCK_COLORS.WHITE)
    ],
    LOD1: [RectVisual(16, 2.5, 8, 0, 0, 200, 0, STOCK_COLORS.WHITE)],
    LOD2: [RectVisual(16, 2.5, 8, 0, 0, 200, 0, STOCK_COLORS.WHITE)]
};

const RIFLE_VISUAL = {
    LOD0: [RectVisual(12, 2, 6, 0, 0, 0, 0, STOCK_COLORS.WHITE)],
    LOD1: [RectVisual(12, 2, 6, 0, 0, 0, 0, STOCK_COLORS.WHITE)],
    LOD2: [RectVisual(12, 2, 6, 0, 0, 0, 0, STOCK_COLORS.WHITE)]
};

const PISTOL_VISUAL = {
    LOD0: [RectVisual(6, 1.5, 3, 0, 0, 0, 0, STOCK_COLORS.WHITE)],
    LOD1: [RectVisual(6, 1.5, 3, 0, 0, 0, 0, STOCK_COLORS.WHITE)],
    LOD2: [RectVisual(6, 1.5, 3, 0, 0, 0, 0, STOCK_COLORS.WHITE)]
};

const SWORD_VISUAL = {
    LOD0: [
        RectVisual(4, 1, 1, 0, 0, 255, 0, STOCK_COLORS.LEATHER),
        RectVisual(1, 6, 3, 0, 0, 150, 0, STOCK_COLORS.WHITE),
        ShapeVisual([
            { x: 3.5, y: 0.75, curve: false },
            { x: 15, y: 0.5, curve: true },
            { x: 20, y: 0, curve: false },
            { x: 15, y: -0.5, curve: true },
            { x: 3.5, y: -0.75, curve: false }
        ], 200, 0, STOCK_COLORS.WHITE),
        TriangleVisual(3.5, 0.25, 18, 0, 3.5, -0.25, 160, 0, STOCK_COLORS.WHITE)
    ],
    LOD1: [
        RectVisual(4, 1, 1, 0, 0, 255, 0, STOCK_COLORS.LEATHER),
        RectVisual(1, 6, 3, 0, 0, 150, 0, STOCK_COLORS.WHITE),
        ShapeVisual([
            { x: 3.5, y: 0.75, curve: false },
            { x: 15, y: 0.5, curve: true },
            { x: 20, y: 0, curve: false },
            { x: 15, y: -0.5, curve: true },
            { x: 3.5, y: -0.75, curve: false }
        ], 200, 0, STOCK_COLORS.WHITE)
    ],
    LOD2: [
        ShapeVisual([
            { x: 0, y: 0.75, curve: false },
            { x: 3.5, y: 0.75, curve: false },
            { x: 15, y: 0.5, curve: true },
            { x: 20, y: 0, curve: false },
            { x: 15, y: -0.5, curve: true },
            { x: 3.5, y: -0.75, curve: false },
            { x: 0, y: -0.75, curve: false }
        ], 200, 0, STOCK_COLORS.WHITE)
    ]
};

const DAGGER_VISUAL = {
    LOD0: [
        RectVisual(4, 1, 1, 0, 0, 255, 0, STOCK_COLORS.LEATHER),
        RectVisual(1, 4, 3, 0, 0, 150, 0, STOCK_COLORS.WHITE),
        ShapeVisual([
            { x: 3.5, y: 0.75, curve: false },
            { x: 10, y: 0.5, curve: true },
            { x: 12, y: 0, curve: false },
            { x: 10, y: -0.5, curve: true },
            { x: 3.5, y: -0.75, curve: false }
        ], 200, 0, STOCK_COLORS.WHITE),
        TriangleVisual(3.5, 0.25, 10, 0, 3.5, -0.25, 160, 0, STOCK_COLORS.WHITE)
    ],
    LOD1: [
        RectVisual(4, 1, 1, 0, 0, 255, 0, STOCK_COLORS.LEATHER),
        RectVisual(1, 4, 3, 0, 0, 150, 0, STOCK_COLORS.WHITE),
        ShapeVisual([
            { x: 3.5, y: 0.75, curve: false },
            { x: 10, y: 0.5, curve: true },
            { x: 12, y: 0, curve: false },
            { x: 10, y: -0.5, curve: true },
            { x: 3.5, y: -0.75, curve: false }
        ], 200, 0, STOCK_COLORS.WHITE),
        TriangleVisual(3.5, 0.25, 10, 0, 3.5, -0.25, 160, 0, STOCK_COLORS.WHITE)
    ],
    LOD2: [
        TriangleVisual(0, 0.8, 0, -0.8, 12, 0, 200, 0, STOCK_COLORS.WHITE)
    ]
};

const GREATSWORD_VISUAL = {
    LOD0: [
        RectVisual(10, 1, -2, 0, 0, 255, 0, STOCK_COLORS.LEATHER),
        CircleVisual(1.5, 1.5, -7.5, 0, 255, 0, STOCK_COLORS.GOLD),
        RectVisual(1, 6, 3, 0, 0, 255, 0, STOCK_COLORS.GOLD),
        ShapeVisual([
            { x: 3.5, y: 0.75, curve: false },
            { x: 30, y: 0.5, curve: true },
            { x: 45, y: 0, curve: false },
            { x: 30, y: -0.5, curve: true },
            { x: 3.5, y: -0.75, curve: false }
        ], 200, 0, STOCK_COLORS.WHITE),
        TriangleVisual(3.5, 0.25, 35, 0, 3.5, -0.25, 160, 0, STOCK_COLORS.WHITE)
    ],
    LOD1: [
        RectVisual(10, 1, -2, 0, 0, 255, 0, STOCK_COLORS.LEATHER),
        RectVisual(1, 6, 3, 0, 0, 255, 0, STOCK_COLORS.GOLD),
        ShapeVisual([
            { x: 3.5, y: 0.75, curve: false },
            { x: 30, y: 0.5, curve: true },
            { x: 45, y: 0, curve: false },
            { x: 30, y: -0.5, curve: true },
            { x: 3.5, y: -0.75, curve: false }
        ], 200, 0, STOCK_COLORS.WHITE)
    ],
    LOD2: [
        RectVisual(1, 6, 3, 0, 0, 255, 0, STOCK_COLORS.GOLD),
        ShapeVisual([
            { x: -7, y: 0.5, curve: false },
            { x: 3, y: 0.5, curve: false },
            { x: 3.5, y: 0.75, curve: false },
            { x: 30, y: 0.5, curve: true },
            { x: 45, y: 0, curve: false },
            { x: 30, y: -0.5, curve: true },
            { x: 3.5, y: -0.75, curve: false },
            { x: 3, y: -0.5, curve: false },
            { x: -7, y: -0.5, curve: false }
        ], 200, 0, STOCK_COLORS.WHITE)
    ],
};

const ANGELIC_SWORD_VISUAL = {
    LOD0: [
        new Visual(function (x, y, cols, timeElapsed = 0) {
            push();
            translate(x, y);
            strokeWeight(0);

            fill(...STOCK_COLORS.LEATHER);
            rectMode(CENTER);
            rect(-2, 0, 10, 1);

            fill(200);
            beginShape();
            vertex(3.5, 0.75);
            splineVertex(40, 0.5);
            vertex(60, 0);
            splineVertex(40, -0.5);
            vertex(3.5, -0.75);
            endShape(CLOSE);

            fill(160);
            triangle(3.5, 0.25, 45, 0, 3.5, -0.25);

            fill(...STOCK_COLORS.GOLD);
            ellipse(-7.5, 0, 1.5, 1.5);

            beginShape();
            vertex(2.5, 0);
            vertex(5, -5);
            vertex(6, -5);
            vertex(4.5, 0);
            vertex(6, 5);
            vertex(5, 5);
            endShape(CLOSE);
            pop();
        }, 255)
    ],
    LOD1: [
        new Visual(function (x, y, cols, timeElapsed = 0) {
            push();
            translate(x, y);
            strokeWeight(0);

            fill(...STOCK_COLORS.LEATHER);
            rectMode(CENTER);
            rect(-2, 0, 10, 1);

            fill(200);
            triangle(3.5, 0.75, 3.5, -0.75, 60, 0);

            fill(...STOCK_COLORS.GOLD);

            beginShape();
            vertex(2.5, 0);
            vertex(5, -5);
            vertex(6, -5);
            vertex(4.5, 0);
            vertex(6, 5);
            vertex(5, 5);
            endShape(CLOSE);
            pop();
        }, 255)
    ],
    LOD2: [
        new Visual(function (x, y, cols, timeElapsed = 0) {
            push();
            translate(x, y);
            strokeWeight(0);
            fill(...STOCK_COLORS.LEATHER);
            rectMode(CENTER);
            rect(-2, 0, 10, 1);
            fill(200);
            triangle(2.5, 0.8, 2.5, -0.8, 60, 0);
            pop();
        }, 255)
    ],
};

const SCYTHE_VISUAL = {
    LOD0: [
        // Shaft
        RectVisual(
            30, 1,
            0, 0,
            -Math.PI / 3,
            255, 0, STOCK_COLORS.WOOD
        ),
        ShapeVisual([
            { x: 8.57, y: -15.84, curve: false },
            { x: 9.43, y: -15.34, curve: true },
            { x: 15.3, y: -10.67, curve: true },
            { x: 19, y: -2.9, curve: false },
            { x: 13.13, y: -9.74, curve: true },
            { x: 7.93, y: -12.74, curve: true },
            { x: 7.07, y: -13.24, curve: false },
        ], 150, 0, STOCK_COLORS.WHITE)
    ],
    LOD1: [
        RectVisual(
            30, 1.5,
            0, 0,
            -Math.PI / 3,
            255, 0, STOCK_COLORS.WOOD
        ),
        ShapeVisual([
            { x: 8.57, y: -15.84, curve: false },
            { x: 9.43, y: -15.34, curve: false },
            { x: 15.3, y: -10.67, curve: false },
            { x: 19, y: -2.9, curve: false },
            { x: 13.13, y: -9.74, curve: false },
            { x: 7.93, y: -12.74, curve: false },
            { x: 7.07, y: -13.24, curve: false },
        ], 150, 0, STOCK_COLORS.WHITE)
    ],
    LOD2: [
        RectVisual(
            30, 1.5,
            0, 0,
            -Math.PI / 3,
            255, 0, STOCK_COLORS.WOOD
        ),
        ShapeVisual([
            { x: 8.57, y: -15.84, curve: false },
            { x: 15.3, y: -10.67, curve: false },
            { x: 19, y: -2.9, curve: false },
            { x: 13.13, y: -9.74, curve: false },
            { x: 7.07, y: -13.24, curve: false },
        ], 150, 0, STOCK_COLORS.WHITE)
    ],
};

const BLOOD_GOBLET_VISUAL = {
    LOD0: [
        CircleVisual(5, 5, 0, 0, 255, 0, STOCK_COLORS.GOLD),
        CircleVisual(4, 4, 0, 0, 255, 0, STOCK_COLORS.CRIMSON)
    ],
    LOD1: [
        CircleVisual(5, 5, 0, 0, 255, 0, STOCK_COLORS.GOLD),
        CircleVisual(4, 4, 0, 0, 255, 0, STOCK_COLORS.CRIMSON)
    ],
    LOD2: [
        CircleVisual(5, 5, 0, 0, 255, 0, STOCK_COLORS.CRIMSON)
    ],
};

const SPEAR_VISUAL = {
    LOD0: [
        RectVisual(36, 1, -2, 0, 0, 255, 0, STOCK_COLORS.WOOD),
        ShapeVisual([
            { x: 14.5, y: 0.5, curve: true },
            { x: 16, y: 1.5, curve: false },
            { x: 20, y: 0, curve: false },
            { x: 16, y: -1.5, curve: false },
            { x: 14.5, y: -0.5, curve: true }
        ], 180, 0, STOCK_COLORS.WHITE),
        TriangleVisual(14.5, 0.5, 19, 0, 14.5, -0.5, 200, 0, STOCK_COLORS.WHITE)
    ],
    LOD1: [
        RectVisual(36, 1, -2, 0, 0, 255, 0, STOCK_COLORS.WOOD),
        ShapeVisual([
            { x: 14.5, y: 0.5, curve: true },
            { x: 16, y: 1.5, curve: false },
            { x: 20, y: 0, curve: false },
            { x: 16, y: -1.5, curve: false },
            { x: 14.5, y: -0.5, curve: true }
        ], 180, 0, STOCK_COLORS.WHITE)
    ],
    LOD2: [
        RectVisual(36, 1, -2, 0, 0, 255, 0, STOCK_COLORS.WOOD),
        TriangleVisual(16, 1.5, 20, 0, 16, -1.5, 180, 0, STOCK_COLORS.WHITE)
    ]
};

const PIKE_VISUAL = {
    LOD0: [
        RectVisual(100, 1, 40, 0, 0, 255, 0, STOCK_COLORS.WOOD),
        ShapeVisual([
            { x: 85, y: 0.5, curve: true },
            { x: 90, y: 1.5, curve: false },
            { x: 100, y: 0, curve: false },
            { x: 90, y: -1.5, curve: false },
            { x: 85, y: -0.5, curve: true }
        ], 180, 0, STOCK_COLORS.WHITE),
        TriangleVisual(85, 0.5, 95, 0, 85, -0.5, 200, 0, STOCK_COLORS.WHITE)
    ],
    LOD1: [
        RectVisual(100, 1, 40, 0, 0, 255, 0, STOCK_COLORS.WOOD),
        ShapeVisual([
            { x: 85, y: 0.5, curve: true },
            { x: 90, y: 1.5, curve: false },
            { x: 100, y: 0, curve: false },
            { x: 90, y: -1.5, curve: false },
            { x: 85, y: -0.5, curve: true }
        ], 180, 0, STOCK_COLORS.WHITE)
    ],
    LOD2: [
        RectVisual(100, 1, 40, 0, 0, 255, 0, STOCK_COLORS.WOOD),
        TriangleVisual(90, 1.5, 100, 0, 90, -1.5, 180, 0, STOCK_COLORS.WHITE)
    ]
};

const STAFF_VISUAL = {
    LOD0: [
        new Visual(function (x, y, cols, timeElapsed = 0) {
            push()
            translate(x, y);
            fill(...STOCK_COLORS.WOOD);
            rectMode(CENTER);
            strokeWeight(0);
            rect(6, 0, 36, 1);
            fill(...STOCK_COLORS.EMERALD);
            beginShape();
            vertex(0, 0);
            splineVertex(0, 0);
            splineVertex(6, 1);
            splineVertex(12, -1);
            splineVertex(17, 2);
            splineVertex(19, 2);
            splineVertex(24, 0.25);
            splineVertex(25, -0.5);
            splineVertex(24, -1.25);
            splineVertex(18, 1);
            splineVertex(12, -2);
            splineVertex(6, 0.5);
            splineVertex(0, 0);
            endShape(CLOSE);
            fill(...STOCK_COLORS.WOOD);
            rect(16, 0, 8, 1);
            rect(2, 0, 6, 1);
            pop()
        }, 255)
    ],
    LOD1: [
        new Visual(function (x, y, cols, timeElapsed = 0) {
            push()
            translate(x, y);
            fill(...STOCK_COLORS.WOOD);
            rectMode(CENTER);
            strokeWeight(0);
            rect(6, 0, 36, 1);
            fill(...STOCK_COLORS.EMERALD);
            beginShape();
            vertex(0, 0);
            splineVertex(0, 0);
            splineVertex(6, 1);
            splineVertex(12, -1);
            splineVertex(17, 2);
            splineVertex(19, 2);
            splineVertex(24, 0.25);
            splineVertex(25, -0.5);
            splineVertex(24, -1.25);
            splineVertex(18, 1);
            splineVertex(12, -2);
            splineVertex(6, 0.5);
            splineVertex(0, 0);
            endShape(CLOSE);
            pop()
        }, 255)
    ],
    LOD2: [
        RectVisual(36, 1, 12, 0, 0, 255, 0, STOCK_COLORS.WOOD)
    ]
};

const ARQUEBUS_VISUAL = {
    LOD0: [
        RectVisual(15, 1.5, 7.5, 0, 0, 220, 0, STOCK_COLORS.WOOD),
        RectVisual(15, 1, 10, 0, 0, 120, 0, STOCK_COLORS.WHITE)
    ],
    LOD1: [
        RectVisual(15, 1.5, 7.5, 0, 0, 220, 0, STOCK_COLORS.WOOD),
        RectVisual(15, 1, 10, 0, 0, 120, 0, STOCK_COLORS.WHITE)
    ],
    LOD2: [
        RectVisual(16, 1.5, 8, 0, 0, 220, 0, STOCK_COLORS.WOOD)
    ]
};

const FLINTLOCK_VISUAL = {
    LOD0: [
        RectVisual(7, 1, 3.5, 0, 0, 220, 0, STOCK_COLORS.WOOD),
        RectVisual(7, 0.8, 4, 0, 0, 140, 0, STOCK_COLORS.WHITE)
    ],
    LOD1: [
        RectVisual(7, 1, 3.5, 0, 0, 220, 0, STOCK_COLORS.WOOD),
        RectVisual(7, 0.8, 4, 0, 0, 140, 0, STOCK_COLORS.WHITE)
    ],
    LOD2: [
        RectVisual(7.5, 1, 3.75, 0, 0, 220, 0, STOCK_COLORS.WOOD)
    ]
};

const LANCE_VISUAL = {
    LOD0: [
        ShapeVisual([
            { x: -4, y: 0.5, curve: false },
            { x: 0.5, y: 0.5, curve: false },
            { x: 0.5, y: 2, curve: false },
            { x: 10, y: 1, curve: true },
            { x: 50, y: 0, curve: false },
            { x: 10, y: -1, curve: true },
            { x: 0.5, y: -2, curve: false },
            { x: 0.5, y: -0.5, curve: false },
            { x: -4, y: -0.5, curve: false }
        ], 255, 0),
        TriangleVisual(40, 0.5, 50, 0, 40, -0.5, 200, 0, STOCK_COLORS.WHITE)
    ],
    LOD1: [
        ShapeVisual([
            { x: -4, y: 0.5, curve: false },
            { x: 0.5, y: 0.5, curve: false },
            { x: 0.5, y: 2, curve: false },
            { x: 10, y: 1, curve: true },
            { x: 50, y: 0, curve: false },
            { x: 10, y: -1, curve: true },
            { x: 0.5, y: -2, curve: false },
            { x: 0.5, y: -0.5, curve: false },
            { x: -4, y: -0.5, curve: false }
        ], 255, 0)
    ],
    LOD2: [
        TriangleVisual(0.5, 2, 50, 0, 0.5, -2, 255, 1)
    ],
};

const BOW_VISUAL = {
    LOD0: [
        // String
        LineVisual([
            { x: -2, y: -7.5, curve: false },
            { x: -3, y: 0, curve: false },
            { x: -2, y: 7.5, curve: false }
        ], 255, 0.5, [255, 255, 255, 150]),
        // Bow
        LineVisual([
            { x: -1.7, y: 9, curve: true },
            { x: -2, y: 7.5, curve: true },
            { x: -1.8, y: 6.5, curve: true },
            { x: -0.32, y: 4.65, curve: true },
            { x: 0.33, y: 2.75, curve: true },
            { x: 0, y: 1.44, curve: true },
            { x: 0, y: -1.44, curve: true },
            { x: 0.33, y: -2.75, curve: true },
            { x: -0.32, y: -4.65, curve: true },
            { x: -1.8, y: -6.5, curve: true },
            { x: -2, y: -7.5, curve: true },
            { x: -1.7, y: -9, curve: true },
        ], 255, 1, STOCK_COLORS.WOOD)
    ],
    LOD1: [
        // Bow
        LineVisual([
            { x: -1.7, y: 9, curve: true },
            { x: -2, y: 7.5, curve: true },
            { x: -1.8, y: 6.5, curve: true },
            { x: -0.32, y: 4.65, curve: true },
            { x: 0.33, y: 2.75, curve: true },
            { x: 0, y: 1.44, curve: true },
            { x: 0, y: -1.44, curve: true },
            { x: 0.33, y: -2.75, curve: true },
            { x: -0.32, y: -4.65, curve: true },
            { x: -1.8, y: -6.5, curve: true },
            { x: -2, y: -7.5, curve: true },
            { x: -1.7, y: -9, curve: true },
        ], 255, 1, STOCK_COLORS.WOOD)
    ],
    LOD2: [
        // Bow
        LineVisual([
            { x: -1.7, y: 9, curve: true },
            { x: -2, y: 7.5, curve: true },
            { x: 0.33, y: 2.75, curve: true },
            { x: 0, y: 1.44, curve: true },
            { x: 0, y: -1.44, curve: true },
            { x: 0.33, y: -2.75, curve: true },
            { x: -2, y: -7.5, curve: true },
            { x: -1.7, y: -9, curve: true },
        ], 255, 1, STOCK_COLORS.WOOD)
    ]
};

const BAYONET_VISUAL = {
    LOD0: [RectVisual(15, 1, 7.5, 0, 0, 255, 0, STOCK_COLORS.WHITE)],
    LOD1: [RectVisual(15, 1, 7.5, 0, 0, 255, 0, STOCK_COLORS.WHITE)],
    LOD2: [RectVisual(15, 1, 7.5, 0, 0, 255, 0, STOCK_COLORS.WHITE)]
};

const HEAVY_CANNON_VISUAL = {
    LOD0: [
        new Visual(function (x, y, cols, timeElapsed=1) {
            const shaded = cols.map(c => c * 180 / 255);
            push();
            translate(x, y);
            fill(...shaded);
            // stroke(50);
            // strokeWeight(1);
            // beginShape();
            // vertex(-10, -15);
            // vertex(-15, -10);
            // vertex(-15, 10);
            // vertex(-10, 15);
            // vertex(10, 15);
            // vertex(25, 4);
            // vertex(25, 2.5);
            // vertex(30, 2.5);
            // vertex(30, 2);
            // vertex(35, 2);
            // vertex(35, 1.5);
            // vertex(70, 1.5);
            // vertex(70, -1.5);
            // vertex(35, -1.5);
            // vertex(35, -2);
            // vertex(30, -2);
            // vertex(30, -2.5);
            // vertex(25, -2.5);
            // vertex(25, -4);
            // vertex(10, -15);
            // endShape(CLOSE);
            strokeWeight(0);
            beginShape();
            vertex(-10, -15);
            vertex(-15, -10);
            vertex(-15, 10);
            vertex(-10, 15);
            vertex(10, 15);
            vertex(25, 4);
            vertex(25, -4);
            vertex(10, -15);
            endShape(CLOSE);
            fill(180);
            rect(25, -2.5, 5, 5);
            fill(190);
            rect(30, -2, 5, 4);
            fill(200);
            rect(35, -1.5, 35, 3);
            this.cycle = 1;
            const cycle = timeElapsed % (this.cycle * 2);
            const alpha = 100 * (((cycle > this.cycle) ? (1 - cycle + this.cycle) / this.cycle : cycle / this.cycle) * 0.75);
            fill(255, 0, 0, alpha);
            for (let i = 0; i < 10; i++) {
                ellipse(10, 4, i / 3);
            }
            pop();
        }, 255)
    ],
    LOD1: [
        new Visual(function (x, y, cols, timeElapsed=1) {
            const shaded = cols.map(c => c * 180 / 255);
            push();
            translate(x, y);
            fill(...shaded);
            strokeWeight(0);
            beginShape();
            vertex(-10, -15);
            vertex(-15, -10);
            vertex(-15, 10);
            vertex(-10, 15);
            vertex(10, 15);
            vertex(25, 4);
            vertex(25, -4);
            vertex(10, -15);
            endShape(CLOSE);
            fill(180);
            rect(25, -2.5, 5, 5);
            fill(190);
            rect(30, -2, 5, 4);
            fill(200);
            rect(35, -1.5, 35, 3);
            this.cycle = 1;
            const cycle = timeElapsed % (this.cycle * 2);
            const alpha = 200 * (((cycle > this.cycle) ? (1 - cycle + this.cycle) / this.cycle : cycle / this.cycle) * 0.75);
            fill(255, 0, 0, alpha);
            ellipse(10, 4, 3.33);
            pop();
        }, 255)
    ],
    LOD2: [
        new Visual(function (x, y, cols, timeElapsed) {
            const shaded = cols.map(c => c * 180 / 255);
            push();
            translate(x, y);
            fill(...shaded);
            strokeWeight(0);
            beginShape();
            vertex(-10, -15);
            vertex(-15, -10);
            vertex(-15, 10);
            vertex(-10, 15);
            vertex(10, 15);
            vertex(25, 4);
            vertex(25, -4);
            vertex(10, -15);
            endShape(CLOSE);
            fill(190);
            rect(25, -2, 45, 4);
            pop();
        }, 255)
    ]
};

const MACHINE_GUN_VISUAL = {
    LOD0: [RectVisual(16, 3, 8, 0, 0, 200, 0, STOCK_COLORS.WHITE)],
    LOD1: [RectVisual(16, 3, 8, 0, 0, 200, 0, STOCK_COLORS.WHITE)],
    LOD2: [RectVisual(16, 3, 8, 0, 0, 200, 0, STOCK_COLORS.WHITE)]
};

const SHORT_MACHINE_GUN_VISUAL = {
    LOD0: [RectVisual(4, 3, 2, 0, 0, 200, 0, STOCK_COLORS.WHITE)],
    LOD1: [RectVisual(4, 3, 2, 0, 0, 200, 0, STOCK_COLORS.WHITE)],
    LOD2: [RectVisual(4, 3, 2, 0, 0, 200, 0, STOCK_COLORS.WHITE)]
};

const PARTICLE_LANCE_VISUAL = {
    LOD0: [
        RectVisual(4, 3, 2, 0, 0, 200, 0, STOCK_COLORS.WHITE),
        RectVisual(8, 2, 8, 0, 0, 220, 0, STOCK_COLORS.WHITE)
    ],
    LOD1: [
        RectVisual(4, 3, 2, 0, 0, 200, 0, STOCK_COLORS.WHITE),
        RectVisual(8, 2, 8, 0, 0, 220, 0, STOCK_COLORS.WHITE)
    ],
    LOD2: [
        RectVisual(4, 3, 2, 0, 0, 200, 0, STOCK_COLORS.WHITE),
        RectVisual(8, 2, 8, 0, 0, 220, 0, STOCK_COLORS.WHITE)
    ],
};

const MISSILE_LAUNCHER_RIGHT = {
    LOD0: [
        CircleVisual(2, 4, 0, 4, 180, 0, STOCK_COLORS.WHITE),
        CircleVisual(2, 4, -3, 4, 180, 0, STOCK_COLORS.WHITE),
        CircleVisual(2, 4, 3, 4, 180, 0, STOCK_COLORS.WHITE),
        RectVisual(8, 4, 0, 2, 0, 220, 0, STOCK_COLORS.WHITE)
    ],
    LOD1: [
        RectVisual(8, 4, 0, 2, 0, 220, 0, STOCK_COLORS.WHITE)
    ],
    LOD2: [
        RectVisual(8, 4, 0, 2, 0, 220, 0, STOCK_COLORS.WHITE)
    ]
};

const MISSILE_LAUNCHER = {
    LOD0: [
        CircleVisual(4, 2, 4, 0, 180, 0, STOCK_COLORS.WHITE),
        CircleVisual(4, 2, 4, 3, 180, 0, STOCK_COLORS.WHITE),
        CircleVisual(4, 2, 4, -3, 180, 0, STOCK_COLORS.WHITE),
        RectVisual(4, 8, 2, 0, 0, 220, 0, STOCK_COLORS.WHITE)
    ],
    LOD1: [
        RectVisual(4, 8, 2, 0, 0, 220, 0, STOCK_COLORS.WHITE)
    ],
    LOD2: [
        RectVisual(4, 8, 2, 0, 0, 220, 0, STOCK_COLORS.WHITE)
    ]
};

const MISSILE_LAUNCHER_LEFT = {
    LOD0: [
        CircleVisual(2, 4, 0, -4, 180, 0, STOCK_COLORS.WHITE),
        CircleVisual(2, 4, -3, -4, 180, 0, STOCK_COLORS.WHITE),
        CircleVisual(2, 4, 3, -4, 180, 0, STOCK_COLORS.WHITE),
        RectVisual(8, 4, 0, -2, 0, 220, 0, STOCK_COLORS.WHITE)
    ],
    LOD1: [
        RectVisual(8, 4, 0, -2, 0, 220, 0, STOCK_COLORS.WHITE)
    ],
    LOD2: [
        RectVisual(8, 4, 0, -2, 0, 220, 0, STOCK_COLORS.WHITE)
    ]
};

const RAILGUN_VISUAL = {
    LOD0: [
        RectVisual(10, 4, 34, 0, 0, 220, 0, STOCK_COLORS.WHITE),
        RectVisual(20, 6, 20, 0, 0, 200, 0, STOCK_COLORS.WHITE),
        RectVisual(20, 8, 0, 0, 0, 180, 0, STOCK_COLORS.WHITE)
    ],
    LOD1: [
        RectVisual(10, 4, 34, 0, 0, 220, 0, STOCK_COLORS.WHITE),
        RectVisual(20, 6, 20, 0, 0, 200, 0, STOCK_COLORS.WHITE),
        RectVisual(20, 8, 0, 0, 0, 180, 0, STOCK_COLORS.WHITE)
    ],
    LOD2: [
        ShapeVisual([
            { x: 0, y: 4, curve: false },
            { x: 39, y: 2, curve: false },
            { x: 39, y: -2, curve: false },
            { x: 0, y: -4, curve: false }
        ], 200, 0, STOCK_COLORS.WHITE)
    ]
};

const AUTOCANNON_VISUAL = {
    LOD0: [
        RectVisual(25, 2, 12.5, 0, 0, 60, 0, STOCK_COLORS.WHITE),
        RectVisual(15, 3, 7.5, 0, 0, 40, 0, STOCK_COLORS.WHITE),
        RectVisual(6, 5, 6, 4, 0, 60, 0, STOCK_COLORS.WHITE)
    ],
    LOD1: [
        RectVisual(25, 3, 12.5, 0, 0, 40, 0, STOCK_COLORS.WHITE),
        RectVisual(6, 5, 6, 4, 0, 60, 0, STOCK_COLORS.WHITE)
    ],
    LOD2: [
        RectVisual(25, 3, 12.5, 0, 0, 40, 0, STOCK_COLORS.WHITE),
        RectVisual(6, 5, 6, 4, 0, 60, 0, STOCK_COLORS.WHITE)
    ]
};

const TANK_MG_VISUAL = {
    LOD0: [
        RectVisual(20, 1, 10, 0, 0, 60, 0, STOCK_COLORS.WHITE),
        RectVisual(10, 2, 2.5, 0, 0, 40, 0, STOCK_COLORS.WHITE),
        RectVisual(5, 4, 2, 3, 0, 60, 0, STOCK_COLORS.WHITE)
    ],
    LOD1: [
        RectVisual(22.5, 1, 8.75, 0, 0, 60, 0, STOCK_COLORS.WHITE),
        RectVisual(5, 5, 2, 2.5, 0, 60, 0, STOCK_COLORS.WHITE)
    ],
    LOD2: [
        RectVisual(22.5, 1, 8.75, 0, 0, 60, 0, STOCK_COLORS.WHITE),
        RectVisual(5, 5, 2, 2.5, 0, 60, 0, STOCK_COLORS.WHITE)
    ]
};
// PROJECTILES
const ARROW_VISUAL = {
    LOD0: [
        ShapeVisual([
            { x: -2.8, y: 0, curve: false },
            { x: -3.8, y: 0.5, curve: false },
            { x: -2.3, y: 0.5, curve: false },
            { x: -1.3, y: 0, curve: false },
            { x: -2.3, y: -0.5, curve: false },
            { x: -3.8, y: -0.5, curve: false },
        ], 255, 0),
        RectVisual(6, 0.5, 0, 0, 0, 255, 0, STOCK_COLORS.WOOD),
        ShapeVisual([
            { x: 3, y: 0.25, curve: true },
            { x: 3.5, y: 0.5, curve: false },
            { x: 6, y: 0, curve: false },
            { x: 3.5, y: -0.5, curve: false },
            { x: 3, y: -0.25, curve: true }
        ], 180, 0, STOCK_COLORS.WHITE),
        TriangleVisual(4, 0.25, 6.5, 0, 4, -0.25, 200, 0, STOCK_COLORS.WHITE)
    ],
    LOD1: [
        RectVisual(6, 0.5, 0, 0, 0, 255, 0, STOCK_COLORS.WOOD),
        TriangleVisual(3, 0.5, 6, 0, 3, -0.5, 180, 0, STOCK_COLORS.WHITE)
    ],
    LOD2: [
        RectVisual(10, 0.5, 2, 0, 0, 255, 0, STOCK_COLORS.WOOD)
    ]
};

const BLOOD_DROP_VISUAL = {
    LOD0: [
        ShapeVisual([
            { x: 1, y: 0, curve: true },
            { x: 0, y: -1, curve: true },
            { x: -2, y: 0, curve: false },
            { x: 0, y: 1, curve: true }
        ], 255, 0, STOCK_COLORS.CRIMSON)
    ],
    LOD1: [
        CircleVisual(2, 2, 0, 0, 255, 0, STOCK_COLORS.CRIMSON)
    ],
    LOD2: [
        CircleVisual(2, 2, 0, 0, 255, 0, STOCK_COLORS.CRIMSON)
    ]
};

const BULLET_VISUAL = {
    LOD0: [CircleVisual(1, 1, 0, 0, 255, 0)],
    LOD1: [CircleVisual(1, 1, 0, 0, 255, 0)],
    LOD2: [CircleVisual(1, 1, 0, 0, 255, 0)]
};

const FIREBALL_VISUAL = {
    LOD0: [
        new Visual(function (x, y, cols, timeElapsed = 0) {
            push();
            translate(x, y);
            strokeWeight(0);
            fill(...STOCK_COLORS.FLAME1);
            beginShape();
            splineVertex(3, 0);
            splineVertex(0, 3.5);
            splineVertex(-2, 3.5);
            vertex(-9, 0);
            splineVertex(-2, -3.5);
            splineVertex(0, -3.5);
            endShape(CLOSE);
            fill(...STOCK_COLORS.FLAME2);
            beginShape();
            splineVertex(2, 0);
            splineVertex(0, 2.5);
            splineVertex(-1, 2);
            vertex(-6, 0);
            splineVertex(-1, -2);
            splineVertex(0, -2.5);
            endShape(CLOSE);
            fill(...STOCK_COLORS.FLAME3)
            ellipse(0, 0, 2, 2)
            pop();
        }, 255)
    ],
    LOD1: [
        new Visual(function (x, y, cols, timeElapsed = 0) {
            push();
            translate(x, y);
            strokeWeight(0);
            fill(...STOCK_COLORS.FLAME1);
            beginShape();
            splineVertex(3, 0);
            splineVertex(0, 3.5);
            splineVertex(-2, 3.5);
            vertex(-9, 0);
            splineVertex(-2, -3.5);
            splineVertex(0, -3.5);
            endShape(CLOSE);
            fill(...STOCK_COLORS.FLAME3)
            ellipse(0, 0, 2, 2)
            pop();
        }, 255)
    ],
    LOD2: [
        new Visual(function (x, y, cols, timeElapsed = 0) {
            push();
            translate(x, y);
            strokeWeight(0);
            fill(...STOCK_COLORS.FLAME2);
            beginShape();
            splineVertex(3, 0);
            splineVertex(0, 3.5);
            splineVertex(-2, 3.5);
            vertex(-9, 0);
            splineVertex(-2, -3.5);
            splineVertex(0, -3.5);
            endShape(CLOSE);
            pop();
        }, 255)
    ],
}

const CATAPULT_STONE_VISUAL = {
    LOD0: [CircleVisual(15, 15, 0, 0, 190, 0, STOCK_COLORS.WHITE)],
    LOD1: [CircleVisual(15, 15, 0, 0, 190, 0, STOCK_COLORS.WHITE)],
    LOD2: [CircleVisual(15, 15, 0, 0, 190, 0, STOCK_COLORS.WHITE)]
};

const SLUG_VISUAL = {
    LOD0: [CircleVisual(10, 10, 0, 0, 255, 0, STOCK_COLORS.WHITE)],
    LOD1: [CircleVisual(10, 10, 0, 0, 255, 0, STOCK_COLORS.WHITE)],
    LOD2: [CircleVisual(10, 10, 0, 0, 255, 0, STOCK_COLORS.WHITE)]
};

const GRENADE_VISUAL = {
    LOD0: [CircleVisual(5, 5, 0, 0, 255, 0)],
    LOD1: [CircleVisual(5, 5, 0, 0, 255, 0)],
    LOD2: [CircleVisual(5, 5, 0, 0, 255, 0)]
};

const MISSILE_VISUAL = {
    LOD0: [
        TriangleVisual(-2.5, -2.5, -2.5, 2.5, -8, 0, 255, 0, [255, 0, 0, 100]),
        CircleVisual(5, 5, 2.5, 0, 255, 0),
        RectVisual(5, 5, 0, 0, 0, 255, 0)
    ],
    LOD1: [
        CircleVisual(5, 5, 2.5, 0, 255, 0),
        RectVisual(5, 5, 0, 0, 0, 255, 0)
    ],
    LOD2: [
        CircleVisual(7.5, 5, 1.25, 0, 255, 0)
    ],
};

const AUTOCANNON_SHELL_VISUAL = {
    LOD0: [
        CircleVisual(4, 2, 2, 0, 255, 0),
        RectVisual(4, 2, 0, 0, 0, 255, 0)
    ],
    LOD1: [
        CircleVisual(4, 2, 2, 0, 255, 0),
        RectVisual(4, 2, 0, 0, 0, 255, 0)
    ],
    LOD2: [
        CircleVisual(6, 2, 1, 0, 255, 0)
    ],
};

const HEAVY_SHELL_VISUAL = {
    LOD0: [
        RectVisual(6, 4),
        CircleVisual(6, 4, 3, 0, 255)
    ],
    LOD1: [
        RectVisual(6, 4),
        CircleVisual(6, 4, 3, 0, 255)
    ],
    LOD2: [CircleVisual(9, 4, 1.5, 0, 255)]
};

// BASES
const CASTLE_VISUAL = {
    LOD0: [
        new Visual(function (x, y, cols, timeElapsed = 0) {
            push();
            translate(x, y);

            stroke(150);
            fill(234, 208, 168);
            strokeWeight(50);
            strokeJoin(MITER);

            // Walls
            beginShape();
            vertex(0, -173);
            vertex(150, -87);
            vertex(150, 87);
            vertex(0, 173);
            vertex(-150, 87);
            vertex(-150, -87);
            endShape(CLOSE);
            // Crenelations
            stroke(130);
            noFill();
            strokeCap(SQUARE);
            strokeWeight(8);
            drawingContext.setLineDash([20, 20]);
            beginShape();
            vertex(0, -202);
            vertex(175, -101);
            vertex(175, 101);
            vertex(0, 202);
            vertex(-175, 101);
            vertex(-175, -101);
            endShape(CLOSE);

            const shaded = cols.map(c => c * this.shade);
            if (shaded.length > 3)
                shaded[3] = cols[3];
            fill(...shaded);
            strokeWeight(0);
            rectMode(CENTER);
            rect(0, 0, 150, 100);

            pop();
        }, 200)
    ],
    LOD1: [
        new Visual(function (x, y, cols, timeElapsed = 0) {
            push();
            translate(x, y);

            stroke(150);
            fill(234, 208, 168);
            strokeWeight(50);
            strokeJoin(MITER);

            // Walls
            beginShape();
            vertex(0, -173);
            vertex(150, -87);
            vertex(150, 87);
            vertex(0, 173);
            vertex(-150, 87);
            vertex(-150, -87);
            endShape(CLOSE);
            // Crenelations
            stroke(130);
            noFill();
            strokeCap(SQUARE);
            strokeWeight(8);
            drawingContext.setLineDash([20, 20]);
            beginShape();
            vertex(0, -202);
            vertex(175, -101);
            vertex(175, 101);
            vertex(0, 202);
            vertex(-175, 101);
            vertex(-175, -101);
            endShape(CLOSE);

            const shaded = cols.map(c => c * this.shade);
            if (shaded.length > 3)
                shaded[3] = cols[3];
            fill(...shaded);
            strokeWeight(0);
            rectMode(CENTER);
            rect(0, 0, 150, 100);

            pop();
        }, 200)
    ],
    LOD2: [
        new Visual(function (x, y, cols, timeElapsed = 0) {
            push();
            translate(x, y);

            stroke(150);
            fill(234, 208, 168);
            strokeWeight(50);
            strokeJoin(MITER);

            // Walls
            beginShape();
            vertex(0, -173);
            vertex(150, -87);
            vertex(150, 87);
            vertex(0, 173);
            vertex(-150, 87);
            vertex(-150, -87);
            endShape(CLOSE);
            // Crenelations
            stroke(130);
            noFill();
            strokeCap(SQUARE);
            strokeWeight(8);
            drawingContext.setLineDash([20, 20]);
            beginShape();
            vertex(0, -202);
            vertex(175, -101);
            vertex(175, 101);
            vertex(0, 202);
            vertex(-175, 101);
            vertex(-175, -101);
            endShape(CLOSE);

            const shaded = cols.map(c => c * this.shade);
            if (shaded.length > 3)
                shaded[3] = cols[3];
            fill(...shaded);
            strokeWeight(0);
            rectMode(CENTER);
            rect(0, 0, 150, 100);

            pop();
        }, 200)
    ]
};

const VAMP_CASTLE_VISUAL = {
    LOD0: [
        new Visual(function (x, y, cols, timeElapsed = 0) {
            push();
            translate(x, y);

            stroke(50);
            fill(61, 77, 73);
            strokeWeight(50);
            strokeJoin(MITER);

            // Walls
            beginShape();
            vertex(0, -173);
            vertex(150, -87);
            vertex(150, 87);
            vertex(0, 173);
            vertex(-150, 87);
            vertex(-150, -87);
            endShape(CLOSE);
            // Crenelations
            stroke(70);
            noFill();
            strokeCap(SQUARE);
            strokeWeight(8);
            drawingContext.setLineDash([20, 20]);
            beginShape();
            vertex(0, -202);
            vertex(175, -101);
            vertex(175, 101);
            vertex(0, 202);
            vertex(-175, 101);
            vertex(-175, -101);
            endShape(CLOSE);

            const shaded = cols.map(c => c * this.shade);
            if (shaded.length > 3)
                shaded[3] = cols[3];
            fill(...shaded);
            strokeWeight(0);
            rectMode(CENTER);
            rect(0, 0, 150, 100);

            pop();
        }, 200)
    ],
    LOD1: [
        new Visual(function (x, y, cols, timeElapsed = 0) {
            push();
            translate(x, y);

            stroke(50);
            fill(61, 77, 73);
            strokeWeight(50);
            strokeJoin(MITER);

            // Walls
            beginShape();
            vertex(0, -173);
            vertex(150, -87);
            vertex(150, 87);
            vertex(0, 173);
            vertex(-150, 87);
            vertex(-150, -87);
            endShape(CLOSE);
            // Crenelations
            stroke(70);
            noFill();
            strokeCap(SQUARE);
            strokeWeight(8);
            drawingContext.setLineDash([20, 20]);
            beginShape();
            vertex(0, -202);
            vertex(175, -101);
            vertex(175, 101);
            vertex(0, 202);
            vertex(-175, 101);
            vertex(-175, -101);
            endShape(CLOSE);

            const shaded = cols.map(c => c * this.shade);
            if (shaded.length > 3)
                shaded[3] = cols[3];
            fill(...shaded);
            strokeWeight(0);
            rectMode(CENTER);
            rect(0, 0, 150, 100);

            pop();
        }, 200)
    ],
    LOD2: [
        new Visual(function (x, y, cols, timeElapsed = 0) {
            push();
            translate(x, y);

            stroke(50);
            fill(61, 77, 73);
            strokeWeight(50);
            strokeJoin(MITER);

            // Walls
            beginShape();
            vertex(0, -173);
            vertex(150, -87);
            vertex(150, 87);
            vertex(0, 173);
            vertex(-150, 87);
            vertex(-150, -87);
            endShape(CLOSE);
            // Crenelations
            stroke(70);
            noFill();
            strokeCap(SQUARE);
            strokeWeight(8);
            drawingContext.setLineDash([20, 20]);
            beginShape();
            vertex(0, -202);
            vertex(175, -101);
            vertex(175, 101);
            vertex(0, 202);
            vertex(-175, 101);
            vertex(-175, -101);
            endShape(CLOSE);

            const shaded = cols.map(c => c * this.shade);
            if (shaded.length > 3)
                shaded[3] = cols[3];
            fill(...shaded);
            strokeWeight(0);
            rectMode(CENTER);
            rect(0, 0, 150, 100);

            pop();
        }, 200)
    ]
};

const FORTIFIED_BASE_VISUAL = {
    LOD0: [
        new Visual(function (x, y, cols, timeElapsed = 0) {
            push();
            translate(x, y);
            strokeWeight(0);
            rectMode(CENTER);
            for (let i = -3; i < 3; i++) {
                push();
                rotate(i * Math.PI / 3);

                fill(225, 191, 146);
                rect(130, -40, 10, 30);
                rect(130, 0, 10, 30);
                rect(130, 40, 10, 30);

                fill(236, 204, 162);
                rect(120, -30, 10, 30);
                rect(120, 10, 10, 30);
                rect(120, 50, 10, 30);

                fill(246, 215, 176);
                rect(125, -50, 10, 30);
                rect(125, -10, 10, 30);
                rect(125, 30, 10, 30);

                pop();
            }

            const shaded = cols.map(c => c * this.shade);
            if (shaded.length > 3)
                shaded[3] = cols[3];
            fill(...cols);
            stroke(...shaded);
            strokeCap(SQUARE);
            for (let i = -60; i <= 60; i += 40) {
                for (let j = -40; j <= 40; j += 30) {
                    strokeWeight(0);
                    rect(i, j, 36, 26);
                    strokeWeight(1);
                    line(i - 18, j, i + 18, j);
                }
            }

            strokeWeight(0);
            fill(...STOCK_COLORS.ENERGY)
            ellipse(0, 0, 320, 320);

            pop();
        }, 220)
    ],
    LOD1: [
        new Visual(function (x, y, cols, timeElapsed = 0) {
            push();
            translate(x, y);
            strokeWeight(0);
            rectMode(CENTER);
            for (let i = -3; i < 3; i++) {
                push();
                rotate(i * Math.PI / 3);

                fill(225, 191, 146);
                rect(130, -40, 10, 30);
                rect(130, 0, 10, 30);
                rect(130, 40, 10, 30);

                fill(236, 204, 162);
                rect(120, -30, 10, 30);
                rect(120, 10, 10, 30);
                rect(120, 50, 10, 30);

                fill(246, 215, 176);
                rect(125, -50, 10, 30);
                rect(125, -10, 10, 30);
                rect(125, 30, 10, 30);

                pop();
            }

            const shaded = cols.map(c => c * this.shade);
            if (shaded.length > 3)
                shaded[3] = cols[3];
            fill(...cols);
            stroke(...shaded);
            strokeCap(SQUARE);
            for (let i = -60; i <= 60; i += 40) {
                for (let j = -40; j <= 40; j += 30) {
                    strokeWeight(0);
                    rect(i, j, 36, 26);
                    strokeWeight(2);
                    line(i - 18, j, i + 18, j);
                }
            }

            strokeWeight(0);
            fill(...STOCK_COLORS.ENERGY)
            ellipse(0, 0, 320, 320);

            pop();
        }, 220)
    ],
    LOD2: [
        new Visual(function (x, y, cols, timeElapsed = 0) {
            push();
            translate(x, y);
            strokeWeight(0);
            rectMode(CENTER);
            for (let i = -3; i < 3; i++) {
                push();
                rotate(i * Math.PI / 3);

                fill(225, 191, 146);
                rect(130, -40, 10, 30);
                rect(130, 0, 10, 30);
                rect(130, 40, 10, 30);

                fill(236, 204, 162);
                rect(120, -30, 10, 30);
                rect(120, 10, 10, 30);
                rect(120, 50, 10, 30);

                fill(246, 215, 176);
                rect(125, -50, 10, 30);
                rect(125, -10, 10, 30);
                rect(125, 30, 10, 30);

                pop();
            }

            fill(...cols);
            strokeWeight(0);
            for (let i = -60; i <= 60; i += 40) {
                for (let j = -40; j <= 40; j += 30) {
                    rect(i, j, 36, 26);
                }
            }

            fill(...STOCK_COLORS.ENERGY)
            ellipse(0, 0, 320, 320);

            pop();
        }, 220)
    ]
};

const ARROW_TOWER_VISUAL = {
    LOD0: [
        new Visual(function (x, y, cols, timeElapsed = 0) {
            push();
            translate(x, y);
            const shaded = cols.map(c => c * this.shade);
            if (shaded.length > 3)
                shaded[3] = cols[3];
            fill(...shaded);
            strokeWeight(0);
            ellipse(0, 0, 80, 80);
            pop();
        }, 255)
    ],
    LOD1: [
        new Visual(function (x, y, cols, timeElapsed = 0) {
            push();
            translate(x, y);
            const shaded = cols.map(c => c * this.shade);
            if (shaded.length > 3)
                shaded[3] = cols[3];
            fill(...shaded);
            strokeWeight(0);
            ellipse(0, 0, 80, 80);
            pop();
        }, 255)
    ],
    LOD2: [
        new Visual(function (x, y, cols, timeElapsed = 0) {
            push();
            translate(x, y);
            const shaded = cols.map(c => c * this.shade);
            if (shaded.length > 3)
                shaded[3] = cols[3];
            fill(...shaded);
            strokeWeight(0);
            ellipse(0, 0, 80, 80);
            pop();
        }, 255)
    ]
};

const DEFENDER_VISUAL = {
    LOD0: [
        new Visual(function (x, y, cols, timeElapsed = 0) {
            push();
            translate(x, y);
            const shaded = cols.map(c => c * 255 / 190);
            if (shaded.length > 3)
                shaded[3] = cols[3];
            rectMode(CENTER);
            strokeWeight(0);
            fill(0);
            rect(6, 6, 12, 2);
            fill(...shaded);
            rect(0, 0, 4, 15);
            fill(...cols);
            ellipse(0, 0, 10, 10);
            pop();
        }, 255)
    ],
    LOD1: [
        new Visual(function (x, y, cols, timeElapsed = 0) {
            push();
            translate(x, y);
            const shaded = cols.map(c => c * 255 / 190);
            if (shaded.length > 3)
                shaded[3] = cols[3];
            rectMode(CENTER);
            strokeWeight(0);
            fill(0);
            rect(6, 6, 12, 2);
            fill(...shaded);
            rect(0, 0, 4, 15);
            fill(...cols);
            ellipse(0, 0, 10, 10);
            pop();
        }, 255)
    ],
    LOD2: [
        new Visual(function (x, y, cols, timeElapsed = 0) {
            push();
            translate(x, y);
            const shaded = cols.map(c => c * 255 / 190);
            if (shaded.length > 3)
                shaded[3] = cols[3];
            rectMode(CENTER);
            strokeWeight(0);
            fill(0);
            rect(6, 6, 12, 2);
            fill(...shaded);
            rect(0, 0, 4, 15);
            fill(...cols);
            ellipse(0, 0, 10, 10);
            pop();
        }, 255)
    ]
};