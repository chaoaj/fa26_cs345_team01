



class StartScreen {
    constructor() {
        this.btnWidth = 200;
        this.btnHeight = 50;
        this.btnX = RES_X / 2 - this.btnWidth / 2;
        this.btnY = RES_Y / 2 - this.btnHeight / 2;

        // Image Placeholder
        // this.titleImage;
    }

    // preload() {
    //     this.titleImage = loadImage('assets/title.png');
    // }

    tickBefore() {
        background(30, 30, 50); // Alternative background color
    }

    tick(dt) {
        // Draw the title image if it exists
        // if (this.titleImage) {
        //     image(this.titleImage, RES_X / 2 - this.titleImage.width / 2, RES_Y / 4);
        // }

        // Default text before title screen design is finalized
        textAlign(CENTER, CENTER);
        fill(255);
        textSize(40);
        text("Strategy Defense", RES_X / 2, RES_Y / 4);

        // start button
        let isHovered = mouseX >= this.btnX &&
                        mouseX <= this.btnX + this.btnWidth &&
                        mouseY >= this.btnY &&
                        mouseY <= this.btnY + this.btnHeight;

        if (isHovered) {
            fill(100, 160, 210); // Lighter blue when hovering
            cursor(HAND);        // Turns cursor into a pointing hand
        } else {
            fill(70, 130, 180);
            cursor(ARROW);
        }

        stroke(255);
        rect(this.btnX, this.btnY, this.btnWidth, this.btnHeight, 10);

        noStroke();
        fill(255);
        textSize(20);
        text("Press Start", RES_X / 2, this.btnY + this.btnHeight / 2);
    }

    drawAfter() {
        // Optional: Add any additional drawing after the main tick
    }

    mousePressed() {
        let buttonClicked = mouseX >= this.btnX &&
            mouseX <= this.btnX + this.btnWidth &&
            mouseY >= this.btnY &&
            mouseY <= this.btnY + this.btnHeight;

        if (buttonClicked) {
            // Transition to the difficulty selection screen
            // mode = new DifficultySelectionScreen();
            console.log("Start button clicked, difficulty selection placeholder.");
        }
    }

}
