
class GameScreen {
    constructor() {
        this.btnWidth = 100;
        this.btnHeight = 40;
        this.selected = "None";

        this.towerX = RES_X / 2;
        this.towerY = RES_Y / 2;

        // Create randomized river
        this.river = [];

        // Randomly choose whether river is on left or right side
        this.riverOnLeft = random() < 0.5;

        let baseRiverX = this.riverOnLeft ? RES_X * 0.2 : RES_X * 0.8;
        let riverSeed = random(1000);

        for (let y = -20; y <= RES_Y + 20; y += 8) {
            let offset = map(noise(riverSeed + y * 0.02), 0, 1, -50, 50);
            let x = baseRiverX + offset;

            // Keep river away from the tower
            if (this.riverOnLeft) {
                x = constrain(x, 35, this.towerX - 120);
            } else {
                x = constrain(x, this.towerX + 120, RES_X - 35);
            }

            this.river.push({ x, y });
        }

        // Create random trees
        this.trees = [];

        for (let i = 0; i < 20; i++) {
            let x = random(30, RES_X - 30);
            let y = random(70, RES_Y - 30);
            let size = random(30, 60);
            let treeGreen = random(100, 160);

            let nearTower = dist(x, y, this.towerX, this.towerY) < 100;
            let nearRiver = this.isNearRiver(x, y, size / 2 + 18);

            // Only add tree if it's not too close to the tower or river
            if (!nearTower && !nearRiver) {
                this.trees.push({ x, y, size, treeGreen });
            }
        }

        // Create random rocks
        this.rocks = [];

        for (let i = 0; i < 14; i++) {
            let x = random(25, RES_X - 25);
            let y = random(70, RES_Y - 25);
            let w = random(14, 28);
            let h = random(10, 22);
            let gray = random(110, 170);

            let nearTower = dist(x, y, this.towerX, this.towerY) < 90;
            let nearRiver = this.isNearRiver(x, y, max(w, h) / 2 + 10);

            // Only add rock if it's not too close to the tower or river
            if (!nearTower && !nearRiver) {
                this.rocks.push({ x, y, w, h, gray });
            }
        }
    }

    // Helper function: checks if an object is near the river
    isNearRiver(x, y, buffer) {
        for (let point of this.river) {
            if (dist(x, y, point.x, point.y) < buffer + 20) {
                return true;
            }
        }
        return false;
    }

    tickBefore() {
        // Green grass background
        background(100, 170, 80);
    }

    drawRiver() {
        noFill();

        // River bank
        stroke(70, 140, 100);
        strokeWeight(42);
        beginShape();
        for (let point of this.river) {
            vertex(point.x, point.y);
        }
        endShape();

        // Water
        stroke(50, 130, 220);
        strokeWeight(32);
        beginShape();
        for (let point of this.river) {
            vertex(point.x, point.y);
        }
        endShape();

        noStroke();
    }

    drawRocks() {
        for (let rock of this.rocks) {
            fill(rock.gray);
            stroke(90);
            ellipse(rock.x, rock.y, rock.w, rock.h);

            // small highlight
            noStroke();
            fill(rock.gray + 20);
            ellipse(rock.x - rock.w * 0.15, rock.y - rock.h * 0.15, rock.w * 0.35, rock.h * 0.35);
        }
    }

    tick(dt) {
        // Draw river first
        this.drawRiver();

        // Draw rocks
        this.drawRocks();

        // Draw trees
        for (let tree of this.trees) {
            noStroke();
            fill(30, tree.treeGreen, 40);
            circle(tree.x, tree.y, tree.size);
        }

        // Draw Tower in center
        let towerX = this.towerX;
        let towerY = this.towerY;

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