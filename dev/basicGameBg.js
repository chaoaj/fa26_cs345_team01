

class GameScreen {
    constructor() {
        this.btnWidth = 100;
        this.btnHeight = 40;
        this.selected = "None";

        // Create random trees
        this.trees = [];

        for (let i = 0; i < 20; i++) {
            let x = random(30, RES_X - 30);
            let y = random(70, RES_Y - 30);
            let size = random(30, 60);
            let green = random(100, 160);

            // Keep trees away from the middle tower
            if (dist(x, y, RES_X / 2, RES_Y / 2) > 100) {
                this.trees.push({x, y, size, green});
            }
        }
    }

    tickBefore() {
        // Green grass background
        background(100, 170, 80);
    }

    tick(dt) {
        // Draw trees
        for (let tree of this.trees) {
            noStroke();
            fill(30, tree.green, 40);
            circle(tree.x, tree.y, tree.size);
        }

        // Draw Tower in center
        let towerX = RES_X / 2;
        let towerY = RES_Y / 2;

        // Tower body
        fill(120);
        stroke(60);
        rect(towerX - 15, towerY - 20, 30, 45);

        // Tower roof
        fill(80);
        triangle(
            towerX - 20, towerY - 20,
            towerX, towerY - 40,
            towerX + 20, towerY - 20
        );

        // Tower door
        fill(90, 60, 30);
        rect(towerX - 5, towerY + 10, 10, 15);

        // Tower window
        fill(180, 220, 255);
        rect(towerX - 5, towerY - 10, 10, 10);

        // Draw top taskbar
        noStroke();
        fill(50, 70, 50);
        rect(0, 0, RES_X, 60);

        // Taskbar buttons
        this.drawButton("Build", 20);
        this.drawButton("Upgrade", 130);
        this.drawButton("Shop", 240);
        this.drawButton("Settings", 350);

        // Display selected option
        fill(255);
        noStroke();
        textAlign(LEFT, CENTER);
        textSize(16);
        text("Selected: " + this.selected, 15, RES_Y - 20);
    }

    drawButton(label, x) {
        let y = 10;

        let isHovered = mouseX >= x &&
                        mouseX <= x + this.btnWidth &&
                        mouseY >= y &&
                        mouseY <= y + this.btnHeight;

        if (isHovered) {
            fill(120, 170, 100);
            cursor(HAND);
        } else {
            fill(80, 120, 70);
            cursor(ARROW);
        }

        stroke(255);
        rect(x, y, this.btnWidth, this.btnHeight, 5);

        noStroke();
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(16);
        text(label, x + this.btnWidth / 2,
              y + this.btnHeight / 2);
    }

    mousePressed() {
        if (mouseY >= 10 && mouseY <= 50) {
            if (mouseX >= 20 && mouseX <= 120) {
                this.selected = "Build";
            } else if (mouseX >= 130 && mouseX <= 230) {
                this.selected = "Upgrade";
            } else if (mouseX >= 240 && mouseX <= 340) {
                this.selected = "Shop";
            } else if (mouseX >= 350 && mouseX <= 450) {
                this.selected = "Settings";
            }
        }
    }
}
