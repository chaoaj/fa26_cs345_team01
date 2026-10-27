// GLOBAL VARIABLES
// Map sizes
const MAP_W = 3000;
const MAP_H = 3000;
// Min distance between trees, where x is distance and variable = x^2
const MIN_TREE_DIST = 50 * 50;
// Foliage colors
const FOLIAGE_COLORS = [
    [110, 192, 7, 230],
    [52, 162, 3, 230],
    [61, 134, 11, 230],
    [193, 209, 31, 230]
];
const TREE_DENSITY = 1 / 1000;
const SPEEDS = Object.freeze({
    4: Object.freeze({
        name: '4x',
        up: 4,
        down: 2
    }),
    2: Object.freeze({
        name: '2x',
        up: 4,
        down: 1
    }),
    1: Object.freeze({
        name: '1x',
        up: 2,
        down: 0.5
    }),
    0.5: Object.freeze({
        name: '1/2x',
        up: 1,
        down: 0.25
    }),
    0.25: Object.freeze({
        name: '1/4x',
        up: 0.5,
        down: 0
    }),
    0: Object.freeze({
        name: '⏸',
        up: 0.25,
        down: 0
    }),
});

// ENUMS
/**
 * Each menu stage has a value, the tick/draw/mouse functions use a switch
 * statement to determine which stage we're on
 */
const MenuStages = Object.freeze({
    MAIN: 1,     // Main Menu
    SELECT: 2,   // Select Faction
    OWNFACTION: 3,      // Select own faction
    ENEMYFACTION: 4,    // Select enemy faction
    FACTION: 5,  // Faction Details/Confirm Faction
    SETTINGS: 6, // Settings (TODO)
    VICTORY: 7,  // Post-Battle: Victory (ONLY REALLY WORKS FOR POST-FIELD BATTLE RN)
    DEFEAT: 8    // Post-Battle: Defeat (ONLY REALLY WORKS FOR POST-FIELD BATTLE RN)
});

/**
 * Different map types affect the Map initialization.
 */
const MapType = Object.freeze({
    GROUND: 1,  // Ground has light green bg and trees
    SPACE: 2,   // Space has black bg and stars
    OCEAN: 3    // Ocean has light blue bg
});

/**
 * Battle Types. Used by the menu to tell us what type of battle to start
 * after selecting a faction
 */
const BattleType = Object.freeze({
    BATTLE: 1,
    SIEGE: 2
});

/**
 * The base class of a game mode
 */
class Mode {
    constructor() {
        this.uiElements = [];
        this.tooltips = new Set();
        this.hoveredElement = null;
        this.speed = 1;
        mode = this;
    }
    /**
     * Runs while the camera is drawing. Use for all realtime logic,
     * such as AI, movement, etc.
     * @param {number} dt Delta Time - Change in time (in seconds) since the last tick
     */
    tick(dt) { }

    /**
     * Runs before the camera begins drawing. Use for background
     */
    tickBefore() { }

    /**
     * Runs after the camera ends drawing. Use for UI
     */
    drawAfter() {
        for (const element of this.uiElements) {
            if (element.hovered)
                this.hoveredElement = element;
            element.draw();
        }
        for (const element of this.tooltips) {
            element.draw();
        }
    }

    /**
     * Show specific UI element
     * @param {InterfaceElement} element    element to show
     * @param {boolean} [hideAll=true]      hide other UI elements
     * @param {*} [context=null]            new data context
     */
    showUI(element, hideAll = true, context = null) {
        for (const ui of this.uiElements) {
            if (hideAll || ui === element) {
                this.hideUI(ui);
            }
        }
        for (const tt of this.tooltips) {
            if (tt.origin.childOf(element)) {
                this.tooltips.delete(tt);
            }
        }
        element.visible = () => true;
        element.setDataContext(context);
    }

    /**
     * Hide UI element
     * @param {InterfaceElement} element    element to hide 
     */
    hideUI(element) {
        element.visible = () => false;
        for (const tt of this.tooltips) {
            if (tt.origin.childOf(element)) {
                this.tooltips.delete(tt);
            }
        }
    }

    /**
     * What should happen when mouse is pressed
     * @returns {boolean} always false
     */
    mousePressed() { return false; }

    /**
     * What should happen when mouse is released
     * @returns {boolean} always false
     */
    mouseReleased() { return false; }

    /**
     * What should happen when mouse is clicked
     * @returns {boolean} always false
     */
    mouseClicked() { return false; }

    /**
     * What should happen when mouse is dragged
     * @returns {boolean} always false
     */
    mouseDragged() { return false; }

    /**
     * Resizes UI when RES_X/RES_Y are changed
     */
    resizeUI() {
        this.uiElements = [];
        this.tooltips.clear();
    }
}


/**
 * Menu mode
 */
class Menu extends Mode {
    constructor() {
        super();
        this.stage = MenuStages.MAIN;
        this.selectedFaction = null;
        this.selectedEnemy = null;
        let y = RES_Y / 2 - 90;
        this.btnOffset = 0;
        this.battleType = BattleType.BATTLE;
        this.factions = Object.values(factions).map(faction => {
            const obj = {
                faction: faction,
                x: RES_X / 2 - 400,
                y: y,
                w: 800,
                h: 80
            };
            if (faction.playable)
                y += 100;
            return obj;
        });
        this.squadUI = initializeInterface(FACTION_SCREEN, null, null, true);
        this.enemyFactionUI = selectionScreen("Select Enemy Faction", [...this.factions.map(f => {
            return {
                text: f.faction.name,
                bg: f.faction.bgColor,
                hoverBg: f.faction.darkerColor,
                onClick: () => {
                    this.stage = MenuStages.FACTION;
                    this.showUI(this.squadUI, true, this.selectedFaction);
                    this.selectedEnemy = f.faction;
                }
            };
        }), {
            text: "Go Back",
            bg: [52, 98, 173],
            hoverBg: [39, 74, 130],
            onClick: () => {
                this.showUI(this.mainUI)
            }
        }]);
        this.factionUI = selectionScreen("Select Faction", [...this.factions.filter(f => f.faction.playable).map(f => {
            return {
                text: f.faction.name,
                bg: f.faction.bgColor,
                hoverBg: f.faction.darkerColor,
                onClick: () => {
                    this.stage = MenuStages.ENEMYFACTION;
                    this.selectedFaction = f.faction;
                    // this.squadUI.setDataContext(f.faction);
                    if (this.battleType === BattleType.BATTLE)
                        this.showUI(this.enemyFactionUI);
                    else {
                        this.stage = MenuStages.FACTION;
                        this.showUI(this.squadUI, true, this.selectedFaction);
                        this.selectedEnemy = factions.monsters;
                    }
                }
            };
        }), {
            text: "Go Back",
            bg: [52, 98, 173],
            hoverBg: [39, 74, 130],
            onClick: () => {
                this.showUI(this.mainUI)
            }
        }]);
        this.settingsUI = selectionScreen("Settings", [
            {
                text: "Increase Resolution",
                bg: [52, 98, 173],
                hoverBg: [39, 74, 130],
                onClick: () => {
                    increaseResolution();
                }
            },
            {
                text: "Decrease Resolution",
                bg: [154, 17, 21],
                hoverBg: [115, 12, 15],
                onClick: () => {
                    decreaseResolution();
                }
            },
            {
                text: "Go Back",
                bg: [52, 98, 173],
                hoverBg: [39, 74, 130],
                onClick: () => {
                    this.showUI(this.mainUI)
                }
            }
        ]);
        this.difficultyUI = selectionScreen("Difficulty Level", [
            {
                text: "Easy",
                bg: [52, 98, 173],
                hoverBg: [39, 74, 130],
                onClick: () => {
                    this.startCurrency = 5000;
                    this.stage = MenuStages.OWNFACTION;
                    this.showUI(this.factionUI);
                }
            },
            {
                text: "Medium",
                bg: [103, 57, 97],
                hoverBg: [82, 45, 77],
                onClick: () => {
                    this.startCurrency = 2000;
                    this.stage = MenuStages.OWNFACTION;
                    this.showUI(this.factionUI);
                }
            },
            {
                text: "Hard",
                bg: [154, 17, 21],
                hoverBg: [115, 12, 15],
                onClick: () => {
                    this.startCurrency = 1000;
                    this.stage = MenuStages.OWNFACTION;
                    this.showUI(this.factionUI);
                }
            }
        ]);
        this.mainUI = selectionScreen("Main Menu", [
            {
                text: "Battle",
                bg: [154, 17, 21],
                hoverBg: [115, 12, 15],
                onClick: () => {
                    this.stage = MenuStages.SELECT;
                    this.battleType = BattleType.BATTLE;
                    this.showUI(this.difficultyUI);
                }
            },
            {
                text: "Siege",
                bg: [154, 17, 21],
                hoverBg: [115, 12, 15],
                onClick: () => {
                    this.stage = MenuStages.SELECT;
                    this.battleType = BattleType.SIEGE;
                    this.showUI(this.difficultyUI);
                }
            },
            {
                text: "Settings",
                bg: [52, 98, 173],
                hoverBg: [39, 74, 130],
                onClick: () => {
                    this.stage = MenuStages.SETTINGS;
                    this.showUI(this.settingsUI);
                }
            }
        ]);
        this.showUI(this.mainUI);
    }

    resizeUI() {
        super.resizeUI();
        this.squadUI = initializeInterface(FACTION_SCREEN, null, null, true);
        this.enemyFactionUI = selectionScreen("Select Enemy Faction", [...this.factions.map(f => {
            return {
                text: f.faction.name,
                bg: f.faction.bgColor,
                hoverBg: f.faction.darkerColor,
                onClick: () => {
                    this.stage = MenuStages.FACTION;
                    this.showUI(this.squadUI, true, this.selectedFaction);
                    this.selectedEnemy = f.faction;
                }
            };
        }), {
            text: "Go Back",
            bg: [52, 98, 173],
            hoverBg: [39, 74, 130],
            onClick: () => {
                this.showUI(this.mainUI)
            }
        }]);
        this.factionUI = selectionScreen("Select Faction", [...this.factions.filter(f => f.faction.playable).map(f => {
            return {
                text: f.faction.name,
                bg: f.faction.bgColor,
                hoverBg: f.faction.darkerColor,
                onClick: () => {
                    this.stage = MenuStages.SELECT;
                    this.selectedFaction = f.faction;
                    // this.squadUI.setDataContext(f.faction);
                    if (this.battleType === BattleType.BATTLE)
                        this.showUI(this.enemyFactionUI);
                    else {
                        this.stage = MenuStages.FACTION;
                        this.showUI(this.squadUI, true, this.selectedFaction);
                        this.selectedEnemy = factions.monsters;
                    }
                }
            };
        }), {
            text: "Go Back",
            bg: [52, 98, 173],
            hoverBg: [39, 74, 130],
            onClick: () => {
                this.showUI(this.mainUI)
            }
        }]);
        this.difficultyUI = selectionScreen("Difficulty Level", [
            {
                text: "Easy",
                bg: [52, 98, 173],
                hoverBg: [39, 74, 130],
                onClick: () => {
                    this.startCurrency = 5000;
                    this.stage = MenuStages.SELECT;
                    this.showUI(this.factionUI);
                }
            },
            {
                text: "Medium",
                bg: [103, 57, 97],
                hoverBg: [82, 45, 77],
                onClick: () => {
                    this.startCurrency = 2000;
                    this.stage = MenuStages.SELECT;
                    this.showUI(this.factionUI);
                }
            },
            {
                text: "Hard",
                bg: [154, 17, 21],
                hoverBg: [115, 12, 15],
                onClick: () => {
                    this.startCurrency = 1000;
                    this.stage = MenuStages.SELECT;
                    this.showUI(this.factionUI);
                }
            }
        ]);
        this.mainUI = selectionScreen("Main Menu", [
            {
                text: "Battle",
                bg: [154, 17, 21],
                hoverBg: [115, 12, 15],
                onClick: () => {
                    this.stage = MenuStages.SELECT;
                    this.battleType = BattleType.BATTLE;
                    this.showUI(this.difficultyUI);
                }
            },
            {
                text: "Siege",
                bg: [154, 17, 21],
                hoverBg: [115, 12, 15],
                onClick: () => {
                    this.stage = MenuStages.SELECT;
                    this.battleType = BattleType.SIEGE;
                    this.showUI(this.difficultyUI);
                }
            },
            {
                text: "Settings",
                bg: [52, 98, 173],
                hoverBg: [39, 74, 130],
                onClick: () => {
                    this.stage = MenuStages.SETTINGS;
                    this.showUI(this.settingsUI);
                }
            }
        ]);
        this.settingsUI = selectionScreen("Settings", [
            {
                text: "Increase Resolution",
                bg: [52, 98, 173],
                hoverBg: [39, 74, 130],
                onClick: () => {
                    increaseResolution();
                }
            },
            {
                text: "Decrease Resolution",
                bg: [154, 17, 21],
                hoverBg: [115, 12, 15],
                onClick: () => {
                    decreaseResolution();
                }
            },
            {
                text: "Go Back",
                bg: [52, 98, 173],
                hoverBg: [39, 74, 130],
                onClick: () => {
                    this.showUI(this.mainUI)
                }
            }
        ]);
        switch (this.stage) {
            case MenuStages.MAIN:
                this.showUI(this.mainUI);
                break;
            case MenuStages.SELECT:
                this.showUI(this.difficultyUI);
                break;
            case MenuStages.FACTION:
                this.showUI(this.squadUI);
                break;
            case MenuStages.ENEMYFACTION:
                this.showUI(this.enemyFactionUI);
                break;
            case MenuStages.OWNFACTION:
                this.showUI(this.factionUI);
                break;
            case MenuStages.SETTINGS:
                this.showUI(this.settingsUI);
                break;
        }
    }

    tickBefore() {
        switch (this.stage) {
            case MenuStages.FACTION:
                background(this.selectedFaction.col);
                break;
            default:
                background(0);
                break;
        }
    }

    drawAfter() {
        for (const element of this.uiElements) {
            if (element.hovered)
                this.hoveredElement = element;
            element.draw();
        }
        for (const element of this.tooltips) {
            element.draw();
        }
        switch (this.stage) {
            case MenuStages.MAIN:
                break;
            case MenuStages.SELECT:
                break;
            case MenuStages.FACTION:
                break;
            case MenuStages.SETTINGS:
                // TODO
                // textAlign(CENTER, CENTER);
                // fill(255);
                // strokeWeight(0);
                // textSize(80);
                // text('SETTINGS', RES_X / 2, RES_Y / 2);
                break;
            // Only real difference between next two is text in center of screen. Unfortunately, JS doesn't have fall through switches in the right way.
            case MenuStages.VICTORY: // Player squads on left, enemy on right
                break;
            case MenuStages.DEFEAT: // Player squads on left, enemy on right
                break;
            default:
                break;
        }
        return;
    }

    mouseClicked() {
        mPos.x = mouseX;
        mPos.y = mouseY;
        for (const element of this.uiElements) {
            if (element.click())
                break;
        }
        switch (this.stage) {
            case MenuStages.MAIN:
                break;
            case MenuStages.SELECT:
                break;
            case MenuStages.FACTION:
                break;
            case MenuStages.SETTINGS:
                // TODO
                // For now, click anywhere in settings to go back
                // this.stage = MenuStages.MAIN;
                // this.showUI(this.mainUI);
                break;
            case MenuStages.VICTORY:
            case MenuStages.DEFEAT:
                // For now, click anywhere in victory/defeat to go to main menu
                this.stage = MenuStages.MAIN;
                this.showUI(this.mainUI);
                break;
            default:
                break;
        }
        return false;
    }

    startBattle() {
        TEAMS.PLAYER = this.selectedFaction.bgColor;
        TEAMS.ENEMY = this.selectedEnemy.bgColor;
        switch (this.battleType) {
            case BattleType.BATTLE: // Just build team units from one of each squad
                let x = 500;
                let y = 250;
                const factionList = [];
                for (const squad of this.selectedFaction.squads) {
                    factionList.push({ x, y, a: 0, squad });
                    y += 500;
                    if (y > 1750) {
                        y = 250;
                        x += 250;
                    }
                }
                let ex = 1500;
                let ey = 250;
                const enemyFactionList = [];
                let budget = 10_000 - this.startCurrency;
                const available = Object.values(this.selectedEnemy.squads)
                    .filter(squad => squad.cost > 0 && squad.cost <= budget);
                // If for some ungodly reason we can't field any units this wave, return now
                if (available.length > 0) {
                    while (true) {
                        // Get troops we can afford to add
                        const affordable = available.filter(squad => squad.cost <= budget);
                        if (affordable.length === 0) // If none, end
                            break;
                        // Add random affordable squad to wave
                        const squad = random(affordable);
                        enemyFactionList.push({ x: ex, y: ey, a: Math.PI, squad });
                        ey += 500;
                        if (ey > 1750) {
                            ey = 250;
                            ex += 250;
                        }
                        budget -= squad.cost;
                        if (budget <= 0)
                            break;
                    }
                }
                new Battle(factionList, enemyFactionList, MapType.GROUND);
                break;
            case BattleType.SIEGE:
                new Siege(this.startCurrency, this.selectedFaction, this.selectedEnemy, MapType.GROUND);
                break;
        }
    }

    backToSelect() {
        this.selectedFaction = null;
        this.showUI(this.factionUI);
        this.stage = MenuStages.SELECT;
        this.tooltips.clear();
    }
}

/**
 * Any form of battle
 */
class CombatMode extends Mode {
    constructor(mapType, siege = false) {
        super();

        const cellSize = mapType == MapType.GROUND
            ? CELL_SIZE
            : SPACE_CELL_SIZE;

        // this.grid = new SpatialGrid(MAP_W, MAP_H, cellSize);
        this.map = new Map(mapType, siege);

        this.finished = false;
        this.paused = false;

        this.playerSquads = new Set();
        this.playerTroops = new Set();

        this.enemySquads = new Set();
        this.enemyTroops = new Set();

        this.movingProjectiles = new Set();
        this.temporaryVisuals = new Set();

        this.selectedSquad = null;

        this.squadUI = initializeInterface(
            SQUAD_SCREEN, null, null, true
        );
        this.hideUI(this.squadUI);
    }

    get pauseBtn() {
        return SPEEDS[this.speed]?.name ?? 'ERROR';
    }

    resizeUI() {
        super.resizeUI();
        this.squadUI = initializeInterface(
            SQUAD_SCREEN, null, this.selectedSquad, true
        );
    }

    tickBefore() {
        mPos = camera.screenToWorld(mouseX, mouseY);
        background(...this.map.bgColor);
    }

    tick(dt) {
        this.paused = dt === 0;
        this.map.drawBg();
        this.drawSelectedSquad();

        if (!this.tickCombatEntities(dt))
            return false;

        this.map.drawFg();
        this.drawFlyingTroops();
        this.tickTemporaryVisuals(dt);

        return true;
    }

    drawAfter() {
        for (const element of this.uiElements) {
            if (element.hovered)
                this.hoveredElement = element;
            element.draw();
        }
        for (const element of this.tooltips) {
            element.draw();
        }
    }

    drawSelectedSquad() {
        if (this.finished ||
            !this.selectedSquad ||
            this.selectedSquad.troops.length === 0) {
            return;
        }

        for (const troop of this.selectedSquad.troops) {
            push();
            noFill();
            translate(troop.pos.x, troop.pos.y);
            strokeWeight(troop.base.size / 5);
            stroke(255, 215, 0);
            ellipse(0, 0, troop.base.size * 3);
            pop();
        }
    }

    tickCombatEntities(dt) {
        for (const squad of this.playerSquads) {
            if (!this.finished && !this.paused && !squad.dead)
                squad.tick(dt);
        }
        for (const squad of this.enemySquads) {
            if (!this.finished && !this.paused && !squad.dead)
                squad.tick(dt);
        }
        for (const troop of this.enemyTroops) {
            if (!this.finished && !this.paused)
                troop.tick(dt);

            if (mode !== this) return false;

            if (!troop.base.flying)
                troop.draw();
        }

        for (const troop of this.playerTroops) {
            if (!this.finished && !this.paused)
                troop.tick(dt);

            if (mode !== this) return false;

            if (!troop.base.flying)
                troop.draw();
        }

        for (const proj of this.movingProjectiles) {
            if (!this.finished && !this.paused)
                proj.tick(dt);

            if (mode !== this) return false;

            proj.draw();
        }

        return true;
    }

    /**
     * Query for all squad troops in radius
     * @param {Position} pos        base position
     * @param {number} radius       radius
     * @param {Squad} ownSquad      squad sending querying
     * @param {boolean} specific    are we getting a specific team?
     * @param {boolean} team        which team? true = player, false = enemy
     */
    queryPos(pos, radius, ownSquad = null, specific = true, team = true) {
        const results = [];
        if (specific) {
            if (team) {
                for (const squad of this.playerSquads) {
                    if (squad.dead)
                        continue;
                    results.push(...squad.queryPos(pos, radius));
                }
            } else {
                for (const squad of this.enemySquads) {
                    if (squad.dead)
                        continue;
                    results.push(...squad.queryPos(pos, radius));
                }
            }
        } else {
            for (const squad of this.playerSquads) {
                if (squad.dead || squad === ownSquad)
                    continue;
                results.push(...squad.queryPos(pos, radius));
            }
            for (const squad of this.enemySquads) {
                if (squad.dead || squad === ownSquad)
                    continue;
                results.push(...squad.queryPos(pos, radius));
            }
        }
        return results;
    }

    drawFlyingTroops() {
        for (const troop of this.enemyTroops) {
            if (troop.base.flying)
                troop.draw();
        }

        for (const troop of this.playerTroops) {
            if (troop.base.flying)
                troop.draw();
        }
    }

    tickTemporaryVisuals(dt) {
        for (const visual of this.temporaryVisuals) {
            if (!('under' in visual) || !visual.under)
                visual.draw();

            if (!this.finished && !this.paused)
                visual.tick(dt);
        }
    }

    mouseDragged() {
        if (this.finished) return;

        const dx = this.mousePos.x - mouseX;
        const dy = this.mousePos.y - mouseY;

        camera.move(
            dx / camera.zoom,
            dy / camera.zoom
        );

        this.mousePos.x = mouseX;
        this.mousePos.y = mouseY;
    }

    mouseReleased() {
        if (this.finished) return;
        this.mousePos = null;
    }

    selectSquadAtMouse() {
        mPos = camera.screenToWorld(mouseX, mouseY);

        this.selectedSquad = getSquadAt(mPos.x, mPos.y);

        if (this.selectedSquad)
            this.showUI(this.squadUI, false, this.selectedSquad);
        else
            this.hideUI(this.squadUI);
    }

    issueSquadOrder() {
        if (!this.selectedSquad ||
            !this.selectedSquad.playerOwned) {
            return;
        }

        mPos = camera.screenToWorld(mouseX, mouseY);

        const target = getSquadAt(mPos.x, mPos.y, false);

        if (target)
            this.selectedSquad.orderAttack(target);
        else
            this.selectedSquad.move(mPos.x, mPos.y);
    }

    checkOver() {
        return false;
    }
}

/**
 * Field battle mode
 */
class Battle extends CombatMode {
    /**
     * @param {Object[]} ps Array of player team squads.
     *                      Each has squad, x, y, and a.
     * @param {Object[]} es Array of enemy team squads.
     * @param {number} mapType Map type: Ground, Space, or Ocean.
     */
    constructor(ps, es, mapType) {
        super(mapType);

        for (const squad of ps) {
            new Squad(
                squad.x, squad.y, squad.a,
                squad.squad, true, this
            );
        }

        for (const squad of es) {
            new Squad(
                squad.x, squad.y, squad.a,
                squad.squad, false, this
            );
        }
    }

    /**
     * Checks whether either army has been eliminated.
     * @returns {boolean} Whether the battle is over.
     */
    checkOver() {
        let over = true;

        for (const squad of this.playerSquads) {
            if (!squad.dead) {
                over = false;
                break;
            }
        }

        if (over) return true;

        over = true;

        for (const squad of this.enemySquads) {
            if (!squad.dead) {
                over = false;
                break;
            }
        }

        return over;
    }

    mousePressed() {
        if (this.finished) return;

        // Preserve the original Battle UI click behavior.
        for (const element of this.uiElements) {
            element.click();
        }

        this.mousePos = new Position(mouseX, mouseY);

        if (mouseButton.left) {
            this.selectSquadAtMouse();
            return false;
        }

        if (mouseButton.right) {
            this.issueSquadOrder();
            return false;
        }

        return false;
    }

    mouseReleased() {
        if (this.finished) {
            new Menu();
            return;
        }

        super.mouseReleased();
    }
}

class Siege extends CombatMode {
    constructor(startCurrency, faction, enemyFaction, mapType) {
        super(mapType, true);

        // Factions determine which squads each side can field.
        this.playerFaction = faction;
        this.enemyFaction = enemyFaction;

        // Currency used to deploy player squads.
        this.currency = startCurrency;

        // Spawn the player's base at the center of the map.
        this.base = new Squad(
            MAP_W / 2, MAP_H / 2,
            0, faction.base, true, this
        );

        this.selectNewSquad = null;

        // Wave settings.
        this.waveTiming = 60;
        this.nextWave = 10;
        this.waveCurrency = 1500;
        this.waveIncrement = 500;
        this.wave = 0;

        // Deployment UI.
        this.deployUI = initializeInterface(
            DEPLOY_SCREEN, null, this, true
        );
        this.deployUI.setDataContext(this);
    }

    get currencyTxt() {
        return Math.round(this.currency);
    }

    get nextWaveTxt() {
        const seconds = Math.max(0, Math.ceil(this.nextWave));
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;

        return `${String(minutes).padStart(1, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    }

    resizeUI() {
        super.resizeUI();
        this.deployUI = initializeInterface(
            DEPLOY_SCREEN, null, this, true
        );
        this.deployUI.setDataContext(this);
        this.squadUI.setDataContext(this.selectedSquad ?? this.selectNewSquad);
    }

    tick(dt) {
        if (!super.tick(dt))
            return;

        // Draw deployment preview.
        if (this.selectNewSquad && !this.finished) {
            push();
            translate(this.base.pos.x, this.base.pos.y);
            noFill();
            strokeWeight(250);
            stroke(150, 255, 150, 50);
            ellipse(0, 0, 750, 750);
            pop();

            const dst = mPos.distanceTo(this.base.pos);

            if (dst >= 250 && dst <= 500) {
                mPos.angle = this.base.pos.angleTo(mPos);
                this.selectNewSquad.drawPhantom(mPos);
            }
        }

        // Advance the wave timer only while the siege is active.
        if (!this.finished && !this.paused) {
            this.nextWave -= dt;

            if (this.nextWave <= 0) {
                this.startWave();
            }
        }
    }

    startWave() {
        this.nextWave = this.waveTiming;
        this.wave++;

        // Available squads that can be afforded by the wave budget.
        let budget = this.waveCurrency;

        const available = Object.values(this.enemyFaction.squads)
            .filter(squad => squad.cost > 0 && squad.cost <= budget);

        // No eligible squads: increase the budget for the next wave.
        if (available.length === 0) {
            this.waveCurrency += this.waveIncrement;
            return;
        }

        // Randomly fill the wave with affordable squads.
        const roster = [];

        while (true) {
            const affordable = available.filter(
                squad => squad.cost <= budget
            );

            if (affordable.length === 0)
                break;

            const squad = random(affordable);
            roster.push(squad);
            budget -= squad.cost;

            if (budget <= 0)
                break;
        }

        // Spawn squads on the map edges and order them to attack the base.
        for (const squad of roster) {
            const direction = Math.floor(Math.random() * 4);

            let x = 0;
            let y = 0;

            switch (direction) {
                case 0: // Top
                    x = Math.random() * (MAP_W - 100) + 50;
                    y = 100;
                    break;

                case 1: // Bottom
                    x = Math.random() * (MAP_W - 100) + 50;
                    y = MAP_H - 100;
                    break;

                case 2: // Left
                    y = Math.random() * (MAP_H - 100) + 50;
                    x = 100;
                    break;

                case 3: // Right
                    y = Math.random() * (MAP_H - 100) + 50;
                    x = MAP_W - 100;
                    break;
            }

            const pos = new Position(x, y, 0);

            const spawned = new Squad(
                x, y, pos.angleTo(this.base.pos),
                squad, false, this
            );

            spawned.orderAttack(this.base);
        }

        // Increase the wave budget, scaling every five waves.
        this.waveCurrency += (
            this.waveIncrement * (Math.floor(this.wave / 5) + 1)
        );
    }

    /**
     * Checks whether the player's base has been destroyed.
     * @returns {boolean} Whether the siege is over.
     */
    checkOver() {
        return this.base.dead;
    }

    mousePressed() {
        if (this.finished) return;

        this.mousePos = new Position(mouseX, mouseY);
        mPos = camera.screenToWorld(mouseX, mouseY);

        // Give UI elements first priority.
        for (const element of this.uiElements) {
            if (element.click())
                return;
        }

        if (mouseButton.left) {
            // Handle placement of a newly purchased squad.
            if (this.selectNewSquad) {
                const dst = mPos.distanceTo(this.base.pos);

                if (dst < 250 || dst > 500) {
                    this.selectNewSquad = null;
                    this.hideUI(this.squadUI);
                    return false;
                }

                new Squad(
                    mPos.x,
                    mPos.y,
                    this.base.pos.angleTo(mPos),
                    this.selectNewSquad,
                    true,
                    this
                );

                this.currency -= this.selectNewSquad.cost;
                this.selectNewSquad = null;
                this.hideUI(this.squadUI);

                return false;
            }

            this.selectSquadAtMouse();
            return false;
        }

        if (mouseButton.right) {
            this.issueSquadOrder();
            return false;
        }

        return false;
    }
}

/**
 * End a field battle
 * @param {Set<Squad>} playerSquads player-side squads 
 * @param {Set<Squad>} enemySquads  enemy-side squads
 * @returns {boolean}               not really needed, but we keep it
 */
function endBattle(playerSquads, enemySquads) {
    // new Menu()
    console.log("End Battle")
    const context = {};
    /* Condense the squads into an array of objects, where each object turns an ingame squad into:
     *  {
     *      base: SquadBase,
     *      count: number of troops still alive
     *      maxCount: total number of troops in the squad to begin with
     *      kills: total kills of the unit
     *  }
     */
    context.playerSquads = Array.from(playerSquads).map(item => {
        let count = 0;
        let maxCount = 0;
        let kills = 0;
        for (const troop of Object.values(item.allTroops)) {
            count += troop.count;
            maxCount += troop.maxCount;
            kills += troop.kills;
        }
        return {
            base: item.base,
            count,
            maxCount,
            kills
        }
    });
    context.enemySquads = Array.from(enemySquads).map(item => {
        let count = 0;
        let maxCount = 0;
        let kills = 0;
        for (const troop of Object.values(item.allTroops)) {
            count += troop.count;
            maxCount += troop.maxCount;
            kills += troop.kills;
        }
        return {
            base: item.base,
            count,
            maxCount,
            kills
        }
    });

    // If the enemy squads are all dead, the player won
    let playerWon = true;
    for (const squad of context.enemySquads) {
        if (squad.count > 0) {
            playerWon = false;
            break;
        }
    }
    context.playerWon = playerWon;
    context.victory = playerWon ? "Victory" : "Defeat";
    mode.finished = true;
    mode.endUI = initializeInterface(BATTLE_END_SCREEN, null, null, true);
    mode.showUI(mode.endUI, true, context);
    // Go to either Victory or Defeat stage
    // if (playerWon) mode.stage = MenuStages.VICTORY;
    // else mode.stage = MenuStages.DEFEAT;
    return true;
}

/**
 * Represents a battle map
 */
class Map {
    /**
     * Create a new Map
     * @param {number} type     A MapType from the enum 
     * @param {boolean=} center If true, don't draw any map objects in center of map to avoid colliding with base 
     */
    constructor(type, center = false) {
        this.width = MAP_W;
        this.height = MAP_H;

        this.type = type;

        // this.grid = new SpatialGrid(MAP_W, MAP_H, 200);

        this.background = [];
        this.foreground = [];
        this.collisions = [];
        this.lines = [];
        this.alpha = 255;

        if (type === MapType.SPACE) {
            // Background is black
            this.bgColor = [0, 0, 0];
            // Generate stars, all in background
            const numStars = Math.floor(Math.random() * 500) + 5;
            for (let i = 0; i < numStars; i++) {
                this.background.push({
                    x: Math.random() * this.width, y: Math.random() * this.height, r: 1.25, v: new Visual(function (x, y, cols, t) {
                        strokeWeight(0);
                        fill(200, 200, 200, alpha);
                        ellipse(0, 0, 2.5, 2.5);
                    })
                });
            }
        }
        else if (type === MapType.GROUND) {
            // Light green background
            this.bgColor = [140, 179, 102];
            /* Determines how many trees there are.
             * This looks a little weird because I was originally generating circular forests that covered part of the map
             * but I later changed it to cover whole map and adapted density code to work with it
             */
            const forestRadius = MAP_W / 12 + Math.random() * MAP_W / 12;
            const forestArea = Math.PI * forestRadius ** 2;
            const numTrees = Math.floor(forestArea * TREE_DENSITY);

            for (let i = 0; i < numTrees; i++) {
                const ro = Math.random() * 50 + 30; // Width of foliage
                const fol = FOLIAGE_COLORS[Math.floor(FOLIAGE_COLORS.length * Math.random())];
                let x, y;

                /* Generate random (x, y) coordinates that don't aren't within MIN_TREE_DIST of another tree
                 * Nor close to center if the param center is true
                 */
                let valid = false;
                while (!valid) {
                    x = Math.random() * this.width;
                    y = Math.random() * this.height;

                    valid = true;
                    if (center && x >= MAP_W / 2 - 300 && x <= MAP_W / 2 + 300 && y >= MAP_H / 2 - 300 && y <= MAP_H / 2 + 300) {
                        valid = false;
                        continue;
                    }
                    for (const tree of this.collisions) {
                        const dx = x - tree.pos.x;
                        const dy = y - tree.pos.y;

                        if (dx * dx + dy * dy < MIN_TREE_DIST) {
                            valid = false;
                            break;
                        }
                    }
                }
                const assoc = [
                    {
                        fg: true,
                        i: this.foreground.push({
                            x: x, y: y, r: ro, v: new Visual(function (alpha) {
                                strokeWeight(0);
                                fill(fol[0], fol[1], fol[2], alpha);
                                ellipse(0, 0, ro, ro);
                            })
                        }) - 1
                    }
                ];
                // Add tree trunk as a collision object
                this.collisions.push(
                    new MapObject(x, y, 5, {
                        size: 5,
                        cover: 1,
                        solid: true,
                        assoc: assoc,
                        destructible: 5_000,
                        visual: CircleVisual(10, 10, 0, 0, 255, 0, [113, 83, 41, 255])
                    }, this)
                );
                // Foliage is added to foreground, and so it is drawn above normal troops

            }
            const river = generateRiver(this, {
                width: 35,
                amplitude: 150
            });

            river.crossings = generateFords(river, 5, 400);
            this.lines.push(river);
        }
        else if (type === MapType.OCEAN) {
            this.bgColor = [0, 157, 196];
        }
        else {
            this.bgColor = [0, 0, 0];
        }
        this.grid = new StaticKDTree(this.collisions);
    }

    /**
     * Draw background and collision objects
     */
    drawBg() {
        if (this.background.length > 0) {
            for (const item of this.background) {
                if (!camera.isInBounds(item.x, item.y, item.r))
                    continue;
                push();
                translate(item.x, item.y);
                item.v.draw(this.alpha);
                pop();
            }
        }
        if (this.collisions.length > 0) {
            for (const item of this.collisions) {
                item.draw();
            }
        }
        if (this.lines.length > 0) {
            for (const item of this.lines) {
                item.draw();
            }
        }
    }

    /**
     * Draw foreground objects. They are drawn transparent based on zoom.
     * Fully zoomed out is nearly opaque, fulled zoomed in is nearly transparent.
     * Based on this.alpha, set by Camera when zooming
     */
    drawFg() {
        if (this.foreground.length > 0) {
            for (const item of this.foreground) {
                if (!camera.isInBounds(item.x, item.y, item.r))
                    continue;
                push();
                translate(item.x, item.y);
                item.v.draw(this.alpha);
                pop();
            }
        }
    }
}

/**
 * Generate a random river crossing the map.
 * @param {Map} map
 * @param {Object} config
 * @returns {LineObject}
 */
function generateRiver(map, config = {}) {
    const width = config.width ?? 35;
    const segments = config.segments ?? 8;
    const amplitude = config.amplitude ?? Math.min(map.width, map.height) * 0.15;

    // Choose horizontal or vertical crossing.
    const horizontal = Math.random() < 0.5;

    let start, end;

    if (horizontal) {
        start = new Position(0, Math.random() * map.height);
        end = new Position(map.width, Math.random() * map.height);
    } else {
        start = new Position(Math.random() * map.width, 0);
        end = new Position(Math.random() * map.width, map.height);
    }

    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const length = Math.hypot(dx, dy);

    // Unit vector perpendicular to the river's general direction.
    const px = -dy / length;
    const py = dx / length;

    // Generate rough control points along the river.
    const points = [start];

    for (let i = 1; i < segments; i++) {
        const t = i / segments;
        const offset = (Math.random() * 2 - 1) * amplitude;

        points.push(new Position(
            Math.max(0, Math.min(map.width,
                start.x + dx * t + px * offset
            )),
            Math.max(0, Math.min(map.height,
                start.y + dy * t + py * offset
            ))
        ));
    }

    points.push(end);

    // Smooth the path using Chaikin subdivision.
    let smooth = points;

    for (let iteration = 0; iteration < 3; iteration++) {
        const next = [smooth[0]];

        for (let i = 0; i < smooth.length - 1; i++) {
            const a = smooth[i];
            const b = smooth[i + 1];

            next.push(new Position(
                0.75 * a.x + 0.25 * b.x,
                0.75 * a.y + 0.25 * b.y
            ));

            next.push(new Position(
                0.25 * a.x + 0.75 * b.x,
                0.25 * a.y + 0.75 * b.y
            ));
        }

        next.push(smooth[smooth.length - 1]);
        smooth = next;
    }

    return new LineObject(smooth, {
        width,
        solid: config.solid ?? false,
        blocks: true,
        cover: config.cover ?? 1,
        visual: new Visual(function (x, y, cols, timeElapsed) {
            push();
            noFill();
            stroke(40, 100, 150);
            strokeWeight(width);
            strokeCap(ROUND);
            strokeJoin(ROUND);
            beginShape();
            for (const p of smooth) {
                vertex(p.x, p.y);
            }
            endShape();
        }, 255)
    }, map);
}

/**
 * Generate ford locations along a river.
 * @param {LineObject} river
 * @param {number} count
 * @param {number} minSpacing Minimum distance between fords
 */
function generateFords(river, count = 2, minSpacing = 300) {
    const points = river.points;
    const segments = [];
    let totalLength = 0;

    for (let i = 0; i < points.length - 1; i++) {
        const a = points[i];
        const b = points[i + 1];
        const length = Math.hypot(b.x - a.x, b.y - a.y);

        segments.push({ a, b, length, start: totalLength });
        totalLength += length;
    }

    const distances = [];

    for (let attempt = 0; attempt < count * 20 && distances.length < count; attempt++) {
        const distance = river.width + Math.random() *
            Math.max(0, totalLength - river.width * 2);

        if (distances.every(d => Math.abs(d - distance) >= minSpacing))
            distances.push(distance);
    }

    return distances.map(distance => {
        const segment = segments.find(s =>
            distance >= s.start && distance <= s.start + s.length
        );

        if (!segment) return null;

        const t = (distance - segment.start) / segment.length;
        const dx = segment.b.x - segment.a.x;
        const dy = segment.b.y - segment.a.y;
        const length = segment.length;

        const angle = Math.atan2(dy, dx);
        const w = river.width + 30;
        return {
            pos: new Position(segment.a.x + dx * t, segment.a.y + dy * t, angle),
            width: w,
            visual: new Visual(function (x, y, cols, timeElapsed) {
                push();
                translate(x, y);
                rotate(angle + Math.PI / 2);
                noStroke();
                fill(176, 125, 55);
                rectMode(CENTER);
                rect(0, 0, w, w * 1.1);
                pop();
            }, 255),
            colors: STOCK_COLORS.WOOD
        };
    }).filter(Boolean);
}

/**
 * Represents a collision object
 */
class MapObject {
    /**
     * New MapObject
     * @param {number} x            center x
     * @param {number} y            center y
     * @param {number} size         radius
     * @param {Object} config       any additional values
     * @param {Map} map             map part of
     */
    constructor(x, y, size, config = {}, map = mode.map) {
        this.pos = new Position(x, y, config.angle ?? 0);
        this.size = size;
        this.cover = config.cover ?? 1;
        this.solid = config.solid ?? true;
        this.blocks = config.blocks ? config.blocks : (config.solid ?? true);
        this.sizeX = config.sizeX ?? size;
        this.sizeY = config.sizeY ?? size;
        this.visual = config.visual ?? null;
        this.map = map;
        this.foreground = config.foreground ?? false;
        this.assoc = config.assoc ?? null;
        this.destructible = config.destructible ?? false;
    }

    /**
     * Destroy a destructible collision object
     * @returns {boolean}   if successful
     */
    destroy() {
        if (this.destructible !== 0 && !this.destructible)
            return false;
        const i = this.map.collisions.indexOf(this);
        this.map.collisions.splice(i, 1);
        if (!this.assoc)
            return;
        for (const item of this.assoc) {
            if (item.fg) {
                this.map.foreground.splice(item.i, 1);
                for (const c of this.map.collisions) {
                    if (!c.assoc || !c.assoc.length)
                        continue;
                    for (const a of c.assoc) {
                        if (a.fg && a.i >= item.i)
                            a.i--;
                    }
                }
            } else {
                this.map.background.splice(item.i, 1);
                for (const c of this.map.collisions) {
                    if (!c.assoc || !c.assoc.length)
                        continue;
                    for (const a of c.assoc) {
                        if (!a.fg && a.i >= item.i)
                            a.i--;
                    }
                }
            }
        }
        this.destroyed = true;
    }

    /**
     * Draw this
     */
    draw() {
        if (!this.visual)
            return;

        if (!camera.isInBounds(
            this.pos.x,
            this.pos.y,
            Math.max(this.sizeX, this.sizeY)
        ))
            return;

        push();
        translate(this.pos.x, this.pos.y);
        rotate(this.pos.angle);
        this.visual.draw(0, 0, [255, 255, 255]);
        pop();
    }

    /**
     * Get radius of self from position's angle to this, since it can have a different x/y radius
     * @param {Position} pos    position of object
     * @returns {number}        radius
     */
    getDirectionalRadius(pos) {
        if (this.sizeX == this.sizeY)
            return this.sizeX;
        const angle = normalizeAngle(pos.angleTo(this.pos) - this.pos.angle)
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);

        return Math.sqrt(
            this.size * this.size * cos * cos +
            this.sizeY * this.sizeY * sin * sin
        );
    }

    /**
     * Get radius of self from angle to this, since it can have a different x/y radius
     * @param {number} angle    angle from
     * @returns {number}        radius
     */
    getDirectionalRadiusAngle(angle) {
        if (this.sizeX == this.sizeY)
            return this.sizeX;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);

        return Math.sqrt(
            this.size * this.size * cos * cos +
            this.sizeY * this.sizeY * sin * sin
        );
    }

    /**
     * Get radius of self from angle, since it can have a different x/y radius
     * @param {Position} pos    position of object
     * @returns {number}        radius
     */
    getRadius(pos) {
        return this.getDirectionalRadius(pos);
    }

    /**
     * Check if there's a collision between it and another item at pos with radius.
     * Fairly simple, needs to later be adapted to account for directional radius
     * @param {Position} pos    position of object
     * @param {Troop} obj       item colliding with 
     * @returns 
     */
    collides(pos, obj) {
        return pos.distanceTo(this.pos) < obj.getDirectionalRadius(this.pos) + this.getDirectionalRadius(pos);
        const r = Math.max(this.sizeX, this.sizeY) + radius;
        return Math.hypot(pos.x - this.pos.x, pos.y - this.pos.y) <= r;
    }

    resolveCollision(pos, unit) {
        const radius = unit.getDirectionalRadius(this.pos)
            + this.getDirectionalRadius(pos);

        const dx = pos.x - this.pos.x;
        const dy = pos.y - this.pos.y;
        const dist = Math.hypot(dx, dy);

        if (dist >= radius)
            return pos;

        // Push away from the collision object's center.
        if (dist === 0) {
            return new Position(
                pos.x + radius,
                pos.y,
                pos.angle
            );
        }

        return new Position(
            this.pos.x + dx / dist * radius,
            this.pos.y + dy / dist * radius,
            pos.angle
        );
    }
}

/**
 * Represents a line-shaped map object, such as a river or wall.
 */
class LineObject {
    /**
     * @param {Position[]} points Points along the line
     * @param {Object} config
     * @param {Map} map
     */
    constructor(points, config = {}, map = mode.map) {
        this.points = points;
        this.width = config.width ?? 20;
        this.solid = config.solid ?? true;
        this.blocks = config.blocks ? config.blocks : (config.solid ?? true);
        this.cover = config.cover ?? 1;
        this.visual = config.visual ?? null;
        this.colors = config.colors ?? [40, 100, 150];
        this.crossings = config.crossings ?? [];
        this.map = map;

        // Bounding-box center, useful for spatial indexing.
        const xs = points.map(p => p.x);
        const ys = points.map(p => p.y);

        this.pos = new Position(
            (Math.min(...xs) + Math.max(...xs)) / 2,
            (Math.min(...ys) + Math.max(...ys)) / 2
        );

        this.sizeX = (Math.max(...xs) - Math.min(...xs)) / 2;
        this.sizeY = (Math.max(...ys) - Math.min(...ys)) / 2;
        this.size = Math.max(this.sizeX, this.sizeY) + this.width / 2;
    }

    draw() {
        if (!camera.isInBounds(
            this.pos.x,
            this.pos.y,
            this.size
        )) return;

        this.visual.draw(0, 0, [], 0);
        // Draw fords over the river
        for (const crossing of this.crossings) {
            crossing.visual.draw(crossing.pos.x, crossing.pos.y, [], 0);
        }
        pop();
    }

    /**
     * Check whether a circular/elliptical unit overlaps this line.
     * @param {Position} pos Candidate unit position
     * @param {Troop} obj Unit being moved
     */
    collides(pos, obj) {
        for (let i = 0; i < this.points.length - 1; i++) {
            const a = this.points[i];
            const b = this.points[i + 1];

            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const lengthSq = dx * dx + dy * dy;

            const t = lengthSq === 0 ? 0 : Math.max(0, Math.min(1,
                ((pos.x - a.x) * dx + (pos.y - a.y) * dy) / lengthSq
            ));

            const closestX = a.x + t * dx;
            const closestY = a.y + t * dy;

            const closest = new Position(closestX, closestY);

            const radius = pos.distanceTo(closest) > 0
                ? obj.getDirectionalRadius(closest)
                : obj.base.maxSize;

            if (pos.distanceTo(closest) < this.width / 2 + radius) {
                const atFord = this.crossings.some(crossing => Math.hypot(closestX - crossing.pos.x, closestY - crossing.pos.y) < crossing.width / 2);
                if (atFord)
                    return false;
                return true;
            }
        }

        return false;
    }

    resolveCollision(pos, unit) {
        const radius = this.width / 2 + unit.base.size;
        let closestX = pos.x;
        let closestY = pos.y;
        let minDistSq = Infinity;

        for (let i = 0; i < this.points.length - 1; i++) {
            const a = this.points[i];
            const b = this.points[i + 1];

            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const lenSq = dx * dx + dy * dy;

            const t = lenSq === 0 ? 0 : Math.max(0, Math.min(1,
                ((pos.x - a.x) * dx + (pos.y - a.y) * dy) / lenSq
            ));

            const x = a.x + t * dx;
            const y = a.y + t * dy;
            const distSq = (pos.x - x) ** 2 + (pos.y - y) ** 2;

            if (distSq < minDistSq) {
                minDistSq = distSq;
                closestX = x;
                closestY = y;
            }
        }

        const dist = Math.sqrt(minDistSq);

        if (dist >= radius) return pos;

        // Push away from the closest point.
        let nx = pos.x - closestX;
        let ny = pos.y - closestY;

        if (dist > 0) {
            nx /= dist;
            ny /= dist;
        } else {
            // Fallback if exactly on the line.
            nx = 1;
            ny = 0;
        }

        return new Position(
            closestX + nx * radius,
            closestY + ny * radius
        );
    }

    closestCrossing(troop, pos, tPos) {
        const dx = tPos.x - pos.x;
        const dy = tPos.y - pos.y;
        const distance = Math.hypot(dx, dy);
        const increment = Math.max(1, Math.min(troop.base.maxSize, this.width));
        let coll = false;
        for (let i = 0; i <= distance; i += increment) {
            const t = Math.min(i / (distance || 1), 1);
            const p = new Position(
                pos.x + dx * t,
                pos.y + dy * t
            );

            if (this.collides(p, troop)) {
                coll = true;
                break;
            }
        }
        if (!coll)
            return null;
        let closest = null;
        let closestDistance = Infinity;
        for (const crossing of this.crossings) {
            const p = getClosestPointOnSegment(crossing.pos, pos, tPos);
            const dst = p.distanceTo(crossing.pos);

            if (dst < closestDistance) {
                closestDistance = dst;
                closest = crossing;
            }
        }
        return closest;
    }
}

function getClosestPointOnSegment(p, a, b) {
    const atob = { x: b.x - a.x, y: b.y - a.y };
    const atop = { x: p.x - a.x, y: p.y - a.y };

    const lenSq = atob.x * atob.x + atob.y * atob.y;
    let dot = atop.x * atob.x + atop.y * atob.y;

    // Clamp t to the 0..1 range to stay on the line segment AB
    let t = lenSq !== 0 ? dot / lenSq : 0;
    t = Math.max(0, Math.min(1, t));

    return new Position(a.x + atob.x * t, a.y + atob.y * t);
}