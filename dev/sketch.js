// function setup() {
//   createCanvas(400, 400);
// }

// function draw() {
//   background(220);
// }

// Team colors, set to defaults to begin
const TEAMS = {
    PLAYER: [80, 120, 255],
    ENEMY: [255, 90, 90]
};
// Mouse position on map (using world coordinates)
let mPos = new Position();
// Current game mode
let mode;

// Initialize all
function setup() {
    createCanvas(RES_X, RES_Y);
    camera = new Camera(MAP_W / 2, MAP_H / 2);
    document.oncontextmenu = () => false; // Right click
    initializeAll(definitions);
    new Menu();
}

/**
 * Draw function. Run mode tickBefore, calculate dt, begin camera, mode tick, end camera, drawAfter
 */
function draw() {
    textStyle(NORMAL);
    mode.tickBefore();
    const dt = deltaTime * 0.001;
    camera.update(dt);
    camera.begin();
    mode.tick(dt * mode.speed);
    camera.end();
    mode.drawAfter();
}

// Run mode functions
function mousePressed() {
    return mode.mousePressed();
}

function mouseClicked() {
    return mode.mouseClicked();
}

function mouseReleased() {
    return mode.mouseReleased();
}

function mouseDragged() {
    return mode.mouseDragged();
}