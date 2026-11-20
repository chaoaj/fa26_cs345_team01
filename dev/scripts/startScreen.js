const BUTTON_OBJECTS = {
    startButton:  { x: 0,   y: 0,  w: 282, h: 80 },
    startHover:   { x: 0,   y: 80, w: 282, h: 80 },
    greyButton:   { x: 0,   y: 176, w: 146, h: 56 },
    greyHover:    { x: 160,   y: 176, w: 146, h: 56 },
    blueButton:   { x: 320,   y: 176, w: 146, h: 56 },
    blueHover:    { x: 480,   y: 176, w: 146, h: 56 },
    redButton:    { x: 640,   y: 176, w: 146, h: 56 },
    redHover:     { x: 800,   y: 176, w: 146, h: 56 },

    imperialGem:  { x: 0,   y: 272, w: 160, h: 184 },
    spiritGem:    { x: 176,  y: 272, w: 144, h: 193 },
    steamGem:      { x: 336, y: 272, w: 170, h: 173 },

    shieldEmblem:  { x: 0,   y: 483, w: 128, h: 238 },

};



class StartScreen {
    constructor() {

        // Calculate button sizes automatically based on your dictionary
        this.startBtnW = BUTTON_OBJECTS.startButton.w;
        this.startBtnH = BUTTON_OBJECTS.startButton.h;
        this.startBtnX = RES_X / 2 - this.startBtnW / 2;
        this.startBtnY = 500;

        // Options & Quit button sizes from dictionary
        this.optBtnW = BUTTON_OBJECTS.greyButton.w;
        this.optBtnH = BUTTON_OBJECTS.greyButton.h;
        this.optBtnX = RES_X / 2 - 200;
        this.optBtnY = 610;

        this.quitBtnW = BUTTON_OBJECTS.redButton.w;
        this.quitBtnH = BUTTON_OBJECTS.redButton.h;
        this.quitBtnX = RES_X / 2 + 54;
        this.quitBtnY = 610;


    }



    tickBefore() {
        background(30, 30, 50); // Alternative background color
    }

    tick(dt) {
        // Draw the title image if it exists
        if (typeof backgroundImage !== 'undefined' && backgroundImage && backgroundImage.width > 0) {
            image(backgroundImage, 0, 0, RES_X, RES_Y);
        } else {
            // Fallback color while loading
            background(30, 30, 50);
        }

        // Default text before title screen design is finalized
        textAlign(CENTER, CENTER);
        if (typeof pixelFont !== 'undefined' && pixelFont) {
            textFont(pixelFont);
        }
        stroke(20, 20, 35);
        strokeWeight(4);
        fill(255);
        textSize(42);
        text("Strategy Defense", RES_X / 2, RES_Y * 0.15);
        noStroke();


        // Faction Gems
        let gemY = 280;
        let spacing = 210;

        let gems = [
            { def: BUTTON_OBJECTS.imperialGem, x: RES_X / 2 - spacing, glowColor: [255, 90, 90] },
            { def: BUTTON_OBJECTS.spiritGem, x: RES_X / 2, glowColor: [80, 220, 120] },
            { def: BUTTON_OBJECTS.steamGem, x: RES_X / 2 + spacing, glowColor: [100, 160, 255] }
        ];

        for (let i = 0; i < gems.length; i++) {
            let gem = gems[i];
            let floatOffset = sin(frameCount * 0.04 + i) * 6;
            let currentY = gemY + floatOffset;



            if (typeof buttonSprites !== 'undefined' && buttonSprites) {
                push();

                // Enable smooth canvas shadow for a true glowing aura matching the sprite shape
                let ctx = drawingContext;
                ctx.shadowBlur = 32; // Controls how soft and blended the glow is
                ctx.shadowColor = color(gem.glowColor[0], gem.glowColor[1], gem.glowColor[2], 200);

                // Draw the gem sprite (the shadow automatically hugs the exact silhouette of the sprite)
                image(buttonSprites,
                    gem.x - gem.def.w / 2, currentY - gem.def.h / 2, gem.def.w, gem.def.h,
                    gem.def.x, gem.def.y, gem.def.w, gem.def.h);

                pop();

                // noStroke();
                // for (let p = 0; p < 5; p++) {
                //     let pAngle = (frameCount * 0.015) + (p * (TWO_PI / 5)) + i;
                //     let pDist = (gem.def.w * 0.6) + sin(frameCount * 0.05 + p) * 12;
                //     let px = gem.x + cos(pAngle) * pDist;
                //     let py = currentY + sin(pAngle * 1.5) * (gem.def.h * 0.45);

                //     fill(gem.glowColor[0], gem.glowColor[1], gem.glowColor[2], 180);
                //     rect(px, py, 4, 4); // Crisp pixel squares
                // }


            }
        }
        // Shield Emblem (Behind the Start Button)
        if (typeof buttonSprites !== 'undefined' && buttonSprites) {
            let shield = BUTTON_OBJECTS.shieldEmblem;
            let shieldX = this.startBtnX + (this.startBtnW / 2) - (shield.w / 2);
            let shieldY = this.startBtnY - 75; // Adjust vertical offset as needed

            image(buttonSprites,
                shieldX, shieldY, shield.w, shield.h,
                shield.x, shield.y, shield.w, shield.h);
        }

        let hoverStart = this.isHovered(this.startBtnX, this.startBtnY, this.startBtnW, this.startBtnH);
        let hoverOpt = this.isHovered(this.optBtnX, this.optBtnY, this.optBtnW, this.optBtnH);
        let hoverQuit = this.isHovered(this.quitBtnX, this.quitBtnY, this.quitBtnW, this.quitBtnH);

        if (hoverStart || hoverOpt || hoverQuit) {
            cursor(HAND);        // Turns cursor into a pointing hand
        } else {
            cursor(ARROW);
        }
        // Hover Start
        if (typeof buttonSprites !== 'undefined' && buttonSprites) {
            let b = hoverStart ? BUTTON_OBJECTS.startHover : BUTTON_OBJECTS.startButton;
            image(buttonSprites,
                this.startBtnX, this.startBtnY, this.startBtnW, this.startBtnH,
                b.x, b.y, b.w, b.h);
        }
        // Hover Options
        if (typeof buttonSprites !== 'undefined' && buttonSprites) {
            let b = hoverOpt ? BUTTON_OBJECTS.greyHover : BUTTON_OBJECTS.greyButton;
            image(buttonSprites,
                this.optBtnX, this.optBtnY, this.optBtnW, this.optBtnH,
                b.x, b.y, b.w, b.h);
        }

        textAlign(CENTER, CENTER);
        fill(255);
        if (typeof pixelFont !== 'undefined' && pixelFont) {
            textFont(pixelFont);
        }
        textSize(12);
        text("OPTIONS", this.optBtnX + this.optBtnW / 2, this.optBtnY + this.optBtnH / 2);

        // Hover Quit
        if (typeof buttonSprites !== 'undefined' && buttonSprites) {
            let b = hoverQuit ? BUTTON_OBJECTS.redHover : BUTTON_OBJECTS.redButton;
            image(buttonSprites,
                this.quitBtnX, this.quitBtnY, this.quitBtnW, this.quitBtnH,
                b.x, b.y, b.w, b.h);
        }

        fill(255);
        textAlign(CENTER, CENTER);
        if (typeof pixelFont !== 'undefined' && pixelFont) {
            textFont(pixelFont);
        }
        textSize(12);
        text("QUIT", this.quitBtnX + this.quitBtnW / 2, this.quitBtnY + this.quitBtnH / 2);
    }

    isHovered(x, y, w, h) {
        return mouseX >= x && mouseX <= x + w && mouseY >= y && mouseY <= y + h;
    }




    drawAfter() {
        // Optional: Add any additional drawing after the main tick
    }

    mousePressed() {
        if (this.isHovered(this.startBtnX, this.startBtnY, this.startBtnW, this.startBtnH)) {
            // Transition to the difficulty selection screen
            mode = new DifficultySelectScreen();
            console.log("Start button clicked.");
        } else if (this.isHovered(this.optBtnX, this.optBtnY, this.optBtnW, this.optBtnH)) {
            // Transition to the options screen
            console.log("Options button clicked.");
        } else if (this.isHovered(this.quitBtnX, this.quitBtnY, this.quitBtnW, this.quitBtnH)) {
            // Quit the game
            console.log("Quit button clicked.");
        }
    }

}
