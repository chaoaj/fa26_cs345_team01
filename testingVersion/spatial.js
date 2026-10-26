/* The spatial grid is a tool I've used to avoid iterating over
 * every single troop/collision object ever time a troop/projectile
 * moves or gets a target. Instead, it subdivides the map into a grid
 * of fixed width-cells.
 * 
 * Troops and collision objects are kept in the corresponding cell that relates
 * to their physical position, and when we need to check collisions and the like,
 * we can simply query the cells that are caught with a circle of radius r from a point.
 */

// Map cell sizes
const CELL_SIZE = 100;
const SPACE_CELL_SIZE = 500;

/**
 * Spatial Grid object. Map and mode each have one, as the map can use a grid
 * with smaller cell sizes since trees aren't going to be that large
 */
class SpatialGrid {
    /**
     * Constructor
     * @param {number} width    should be MAP_W
     * @param {number} height   should be MAP_H
     * @param {number} cellSize size of cells
     */
    constructor(width, height, cellSize) {
        this.cellSize = cellSize;
        this.cols = Math.ceil(width / cellSize);
        this.rows = Math.ceil(height / cellSize);
        this.cells = new Array(this.cols * this.rows);
        this.cells.fill(null);
    }

    /**
     * Get the cell an item should be in based on their (x, y)
     * @param {number} x    x position
     * @param {number} y    y position
     * @returns {number}    index
     */
    getCellIndex(x, y) {
        const col = Math.floor(x / this.cellSize);
        const row = Math.floor(y / this.cellSize);

        if (
            col < 0 || col >= this.cols ||
            row < 0 || row >= this.rows
        ) {
            return -1;
        }

        return row * this.cols + col;
    }

    /**
     * Inserts an item into the grid
     * @param {(Troop|MapObject)} item Troop/collision object to insert
     */
    insert(item) {
        const index = this.getCellIndex(
            item.pos.x,
            item.pos.y
        );

        if (index < 0)
            return;

        if (!this.cells[index])
            this.cells[index] = [];
        item.gridIndex = index;
        this.cells[index].push(item);
    }

    /**
     * Insert an item at a given index rather than calculating their cell index
     * @param {(Troop|MapObject)} item  item to insert
     * @param {number} index            index to insert them in
     * @returns 
     */
    insertIndex(item, index) {
        if (index < 0)
            return;
        if (!this.cells[index])
            this.cells[index] = [];
        item.gridIndex = index;
        this.cells[index].push(item);
    }

    /**
     * Get all cells within a given radius from (x, y) and return all items in those cells
     * @param {number} x                center x
     * @param {number} y                center y
     * @param {number} range            search radius
     * @returns {(Troop|MapObject)[]}   items
     */
    query(x, y, range) {
        if (
            !Number.isFinite(x) ||
            !Number.isFinite(y)
        ) {
            console.error("Invalid SpatialGrid.query:", {
                x,
                y,
                range
            });
            return [];
        }
        if (!Number.isFinite(range) || range < 0)
            range = 0;

        const minCol = Math.max(
            0,
            Math.floor((x - range) / this.cellSize)
        );

        const maxCol = Math.min(
            this.cols - 1,
            Math.floor((x + range) / this.cellSize)
        );

        const minRow = Math.max(
            0,
            Math.floor((y - range) / this.cellSize)
        );

        const maxRow = Math.min(
            this.rows - 1,
            Math.floor((y + range) / this.cellSize)
        );

        if (minCol > maxCol
            || minRow > maxRow) {
            return [];
        }

        const result = [];
        for (let row = minRow; row <= maxRow; row++) {
            for (let col = minCol; col <= maxCol; col++) {
                const cell = this.cells[row * this.cols + col];

                if (cell)
                    result.push(...cell);
            }
        }

        return result;
    }
}


/**
 * Static 2D k-d tree for objects that do not move.
 * Build once after map generation, then query repeatedly.
 */
class StaticKDTree {
    constructor(items = []) {
        this.root = null;
        this.maxSize = 0;

        if (items.length > 0)
            this.rebuild(items);
    }

    /**
     * Build a balanced tree from all objects.
     * @param {(MapObject)[]} items
     */
    rebuild(items) {
        this.maxSize = 0;

        for (const item of items) {
            this.maxSize = Math.max(
                this.maxSize,
                item.sizeX,
                item.sizeY
            );
        }

        this.root = this.#build(items.slice(), 0);
    }

    #build(items, depth) {
        if (items.length === 0)
            return null;

        const axis = depth % 2 === 0 ? "x" : "y";

        items.sort((a, b) => a.pos[axis] - b.pos[axis]);

        const mid = Math.floor(items.length / 2);
        const item = items[mid];

        return {
            item,
            axis,
            left: this.#build(items.slice(0, mid), depth + 1),
            right: this.#build(items.slice(mid + 1), depth + 1)
        };
    }

    /**
     * Return objects whose centers fall within the query rectangle.
     * This is a broad-phase query; use collides() for exact checks.
     *
     * @param {number} x
     * @param {number} y
     * @param {number} range
     * @returns {MapObject[]}
     */
    query(x, y, range) {
        if (!Number.isFinite(x) || !Number.isFinite(y))
            return [];

        if (!Number.isFinite(range) || range < 0)
            range = 0;

        const result = [];
        this.#query(
            this.root,
            x - range,
            y - range,
            x + range,
            y + range,
            result
        );

        return result;
    }

    #query(node, minX, minY, maxX, maxY, result) {
        if (!node)
            return;

        const { item, axis, left, right } = node;
        const x = item.pos.x;
        const y = item.pos.y;

        if (
            x + item.sizeX >= minX && x - item.sizeX <= maxX &&
            y + item.sizeY >= minY && y - item.sizeY <= maxY &&
            !item.destroyed
        ) {
            result.push(item);
        }

        const min = axis === "x" ? minX : minY;
        const max = axis === "x" ? maxX : maxY;
        const split = item.pos[axis];

        if (min <= split)
            this.#query(left, minX, minY, maxX, maxY, result);

        if (max >= split)
            this.#query(right, minX, minY, maxX, maxY, result);
    }

    /**
     * Query potential collisions, accounting for object size.
     */
    queryCollisions(pos, radius) {
        const candidates = this.query(
            pos.x,
            pos.y,
            radius + this.maxSize
        );

        return candidates.filter(
            item => !item.destroyed && item.solid && item.collides(pos, radius)
        );
    }
}