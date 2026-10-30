// Difficulty selection screen.






class DifficultySelectScreen {
    constructor() {
        this.diffWidth = 300;
        this.diffHeight = 60;
        this.diffGap = 30;
        this.diffX = RES_X / 2 - this.diffWidth / 2;

        this.difficulties = [
            { id: "0", name: "Easy", desc: "Ample economy.", col: [20, 200, 0], mult: 2.0 },
            { id: "1", name: "Medium", desc: "Normal economy.", col: [200, 180, 0], mult: 1.0 },
            { id: "2", name: "Hard", desc: "Tight economy.", col: [200, 20, 0], mult: 0.5 }
        ];

        // Stack the buttons vertically, one below the other
        let startY = 200;
        for (let i = 0; i < this.difficulties.length; i++) {
            this.difficulties[i].y = startY + i * (this.diffHeight + this.diffGap);
        }

        this.btnWidth = 200;
        this.btnHeight = 50;
        this.btnX = RES_X / 2 - this.btnWidth / 2;
        let lastCard = this.difficulties[this.difficulties.length - 1];
        this.btnY = lastCard.y + this.diffHeight + 30;
        
        this.selected = null;

    }

    tickBefore() {
        background(30, 30, 50);
    }

    tick(dt) {
        let anyHovered = false;

        textAlign(CENTER, CENTER);
        noStroke();
        fill(255);
        textSize(40);
        text("Select Difficulty", RES_X / 2, 70);

        // Difficulty buttons
        for (let difficulty of this.difficulties) {
            let isHovered = this.isOver(this.diffX, difficulty.y, this.diffWidth, this.diffHeight);
            let isSelected = this.selected === difficulty;
            if (isHovered) {
                anyHovered = true;
            }

            if (isHovered) {
                fill(difficulty.col[0] - 50, difficulty.col[1] - 50, difficulty.col[2] - 50); // darker shade when hovering
            } else {
                fill(difficulty.col);
            }
            stroke(isSelected ? 255 : 120);
            strokeWeight(isSelected ? 4 : 1);
            rect(this.diffX, difficulty.y, this.diffWidth, this.diffHeight, 10);
            strokeWeight(1);

            // Color swatch on the left
            noStroke();
            fill(difficulty.col);
            circle(this.diffX + 40, difficulty.y + this.diffHeight / 2, 50);

            // Name and description to the right of the swatch
            fill(255);
            textAlign(LEFT, TOP);
            textSize(16);
            text(difficulty.name, this.diffX + 80, difficulty.y + 20);

            textSize(12);
            text(difficulty.desc, this.diffX + 80, difficulty.y + 38, this.diffWidth - 200);
            textAlign(CENTER, CENTER);
        }

        // Confirm button, disabled until a faction is selected
        let btnHovered = this.selected !== null &&
                         this.isOver(this.btnX, this.btnY, this.btnWidth, this.btnHeight);
        if (btnHovered) {
            anyHovered = true;
        }

        if (this.selected === null) {
            fill(90);           // Grey when disabled
        } else if (btnHovered) {
            fill(100, 160, 210);
        } else {
            fill(70, 130, 180);
        }

        stroke(255);
        rect(this.btnX, this.btnY, this.btnWidth, this.btnHeight, 10);

        noStroke();
        fill(255);
        textSize(20);
        text("Confirm", RES_X / 2, this.btnY + this.btnHeight / 2);

        // Set cursor once so multiple buttons don't override each other
        cursor(anyHovered ? HAND : ARROW);
    }

    drawAfter() {
        // Optional: Add any additional drawing after the main tick
    }

    mousePressed() {
        for (let difficulty of this.difficulties) {
            if (this.isOver(this.diffX, difficulty.y, this.diffWidth, this.diffHeight)) {
                this.selected = difficulty;
                return;
            }
        }

        if (this.selected !== null && this.isOver(this.btnX, this.btnY, this.btnWidth, this.btnHeight)) {
            // Transition to the faction selection screen
            // gameState.difficulty = this.selected;
            // gameState.economyMultiplier = this.selected.mult;
            mode = new FactionSelectScreen();
            console.log("Difficulty selected: " + this.selected.name);
        }
    }

    isOver(x, y, w, h) {
        return mouseX >= x &&
               mouseX <= x + w &&
               mouseY >= y &&
               mouseY <= y + h;
    }
}
