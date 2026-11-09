
const MAP_OBJECTS = {
    treeGreen:       { x: 0,   y: 0,  w: 32, h: 64 },
    treePine:        { x: 32,  y: 0,  w: 32, h: 64 },
    logHorizontal:   { x: 64,  y: 0,  w: 64, h: 32 },
    bush:            { x: 128, y: 0,  w: 32, h: 32 },
    deadTree:        { x: 160, y: 0,  w: 32, h: 64 },
    mushroomCluster: { x: 192, y: 0,  w: 32, h: 32 },
    tallRock:        { x: 224, y: 0,  w: 32, h: 32 },

    stump:           { x: 64,  y: 32, w: 32, h: 32 },
    simpleRock:      { x: 96,  y: 32, w: 32, h: 32 },
    rockPair:        { x: 128, y: 32, w: 32, h: 32 },
    singleMushroom:  { x: 192, y: 32, w: 32, h: 32 },
    rockCluster:     { x: 224, y: 32, w: 64, h: 32 },

    willowTree:      { x: 0,   y: 64, w: 64, h: 64 },
    fence:           { x: 64,  y: 64, w: 64, h: 32 },
    scarecrow:       { x: 128, y: 64, w: 32, h: 64 },
    pumpkins:        { x: 160, y: 64, w: 32, h: 32 },
    fern:            { x: 192, y: 64, w: 32, h: 32 },
    flatRock:        { x: 224, y: 64, w: 32, h: 32 },

    grassTuft1:      { x: 64,  y: 96, w: 32, h: 32 },
    grassTuft2:      { x: 96,  y: 96, w: 32, h: 32 }
};

class GameScreen {
    constructor() {
        this.btnWidth = 100;
        this.btnHeight = 40;
        this.selected = "None";
        this.troops = [];
        this.playerTeam = { colors: TEAMS.PLAYER };

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

        this.mapObjects = [];
        this.grassObjects = [];
        // Object types to randomly scatter across the map
        let generalTypes = [
            'treeGreen', 'treePine', 'logHorizontal', 'bush', 'deadTree', 'mushroomCluster', 'tallRock',
            'stump', 'simpleRock', 'rockPair', 'singleMushroom', 'rockCluster',
            'willowTree', 'fence', 'pumpkins', 'fern', 'flatRock',
        ];

        let spawnedScarecrow = false;

        for (let i = 0; i < 50; i++) {
            // Pick type first so we know its size properties for proper placement boundaries
            let type;
            if (!spawnedScarecrow && random() < 0.15) {
                type = 'scarecrow';
                spawnedScarecrow = true;
            } else {
                type = random(generalTypes);
            }

            let isWide = (type === 'logHorizontal' || type === 'fence' || type === 'rockCluster' || type === 'willowTree');
            let isTall = (
                type === 'treeGreen' || type === 'treePine' ||
                type === 'deadTree' || type === 'willowTree' || type === 'scarecrow'
            );

            let minY = isTall ? 150 : 100;
            let y = random(minY, RES_Y - 60);

            let currentRiverX = RES_X * 0.5;
            for(let point of this.river) {
                if (abs(point.y - y) < 8) {
                    currentRiverX = point.x;
                    break;
                }
            }

            let edgePadding = isWide ? 90 : 70;
            let riverBuffer = isWide ? 90 : 60;

            let leftSpace = (currentRiverX - riverBuffer) - edgePadding;
            let rightSpace = (RES_X - edgePadding) - (currentRiverX + riverBuffer);

            let x;
            let chooseLeft = random(leftSpace + rightSpace) < leftSpace;

            if (chooseLeft && leftSpace > 40) {
                x = random(edgePadding, currentRiverX - riverBuffer);
            } else if (!chooseLeft && rightSpace > 40) {
                x = random(currentRiverX + riverBuffer, RES_X - edgePadding);
            } else {
                x = leftSpace > rightSpace ? random(edgePadding, currentRiverX - riverBuffer) : random(currentRiverX + riverBuffer, RES_X - edgePadding);
            }

            let nearTower = dist(x, y, this.towerX, this.towerY) < 110;

            let tooClose = false;
            for (let existing of this.mapObjects) {
                if (dist(x, y, existing.x, existing.y) < 65) { // Minimum spacing distance
                    tooClose = true;
                    break;
                }
            }
            if (!nearTower && !tooClose) {
                this.mapObjects.push({ x, y, type });
            }
        }
        console.log("Successfully initialized GameScreen with", this.mapObjects.length, "objects.")
        // GRASS TUFT PLACEMENT
        for (let i = 0; i < 100; i++) {
            let y = random(80, RES_Y - 40);
            let currentRiverX = RES_X * 0.5;
            for (let point of this.river) {
                if (abs(point.y - y) < 8) {
                    currentRiverX = point.x;
                    break;
                }
            }

            let edgePadding = 50;
            let riverBuffer = 45;
            let leftSpace = (currentRiverX - riverBuffer) - edgePadding;
            let rightSpace = (RES_X - edgePadding) - (currentRiverX + riverBuffer);

            let x;
            let chooseLeft = random(leftSpace + rightSpace) < leftSpace;

            if (chooseLeft && leftSpace > 20) {
                x = random(edgePadding, currentRiverX - riverBuffer);
            } else if (!chooseLeft && rightSpace > 20) {
                x = random(currentRiverX + riverBuffer, RES_X - edgePadding);
            } else {
                x = leftSpace > rightSpace ? random(edgePadding, currentRiverX - riverBuffer) : random(currentRiverX + riverBuffer, RES_X - edgePadding);
            }

            let nearTower = dist(x, y, this.towerX, this.towerY) < 90;
            if (!nearTower) {
                let type = random(['grassTuft1', 'grassTuft2']);
                this.grassObjects.push({ x, y, type });
            }
        }
        this.mapObjects.sort((a, b) => a.y - b.y);
        this.grassObjects.sort((a, b) => a.y - b.y);
        /* Create random rocks
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
            */
    }

    // Helper function: checks if an object is near the river
    /* isNearRiver(x, y, buffer) {
        for (let point of this.river) {
            if (dist(x, y, point.x, point.y) < buffer) {
                return true;
            }
        }
        return false;
    }
        */

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

    /* drawRocks() {
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
        */

    tick(dt) {
        // Draw river first
        this.drawRiver();

        for (let obj of this.grassObjects) {
            let cut = MAP_OBJECTS[obj.type];
            let scaleFactor = 1.2; // Smaller size for grass!

            let destW = cut.w * scaleFactor;
            let destH = cut.h * scaleFactor;
            let drawX = obj.x - destW / 2;
            let drawY = obj.y - destH;

            if (typeof mapSprites !== 'undefined' && mapSprites && mapSprites.width > 0) {
                image(mapSprites, drawX, drawY, destW, destH, cut.x, cut.y, cut.w, cut.h);
            }
        }

        for (let obj of this.mapObjects) {
            let cut = MAP_OBJECTS[obj.type];
            let scaleFactor = 2;

            let destW = cut.w * scaleFactor;
            let destH = cut.h * scaleFactor;

            let drawX = obj.x - destW / 2;
            let drawY = obj.y - destH;


            image(mapSprites, drawX, drawY, destW, destH, cut.x, cut.y, cut.w, cut.h);
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
    drawAfter() {
        for (const troop of this.troops) {
            troop.draw();
        }
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
        strokeWeight(1);
        rect(x, y, this.btnWidth, this.btnHeight, 5);

        noStroke();
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(16);
        text(label, x + this.btnWidth / 2,
            y + this.btnHeight / 2);
    }

    mousePressed() {
        if (mouseButton !== LEFT) {
            return;
        }

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

        if (mouseY < 60) {
            return;
        }

        this.spawnTroop(new Position(mouseX, mouseY));
        console.log("Total objects successfully generated:", this.mapObjects.length);
    }

    spawnTroop(position) {
        const base = troopBases["basic"];

        const troop = new Troop(position, this.playerTeam, base);
        this.troops.push(troop);
        return troop;
    }
}
