// Game over screen.
// To show it (e.g. when the central base reaches zero health):
//     mode = new GameOverScreen();

class GameOverScreen {
    constructor() {
        this.speed = 1;

        this.btnWidth = 200;
        this.btnHeight = 50;
        this.btnX = RES_X / 2 - this.btnWidth / 2;
        this.btnY = RES_Y / 2 + 40;
    }

    tickBefore() {
        background(30, 30, 50);
    }

    tick(dt) {
        textAlign(CENTER, CENTER);
        noStroke();
        fill(255, 90, 90);
        textSize(48);
        text("Game Over", RES_X / 2, RES_Y / 2 - 60);

        // Restart button
        let isHovered = this.isOver(this.btnX, this.btnY, this.btnWidth, this.btnHeight);

        if (isHovered) {
            fill(100, 160, 210);
            cursor(HAND);
        } else {
            fill(70, 130, 180);
            cursor(ARROW);
        }

        stroke(255);
        rect(this.btnX, this.btnY, this.btnWidth, this.btnHeight, 10);

        noStroke();
        fill(255);
        textSize(20);
        text("Restart", RES_X / 2, this.btnY + this.btnHeight / 2);
    }

    drawAfter() {
        // Optional: Add any additional drawing after the main tick
    }

    mousePressed() {
        if (this.isOver(this.btnX, this.btnY, this.btnWidth, this.btnHeight)) {
            // Start a fresh game
            mode = new GameScreen();
            console.log("Game restarted.");
        }
    }

    isOver(x, y, w, h) {
        return mouseX >= x &&
               mouseX <= x + w &&
               mouseY >= y &&
               mouseY <= y + h;
    }
}