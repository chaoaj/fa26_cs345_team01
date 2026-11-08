/**
 * Find path to target
 * @param {Troop} troop     troop finding path
 * @param {Position} pos    target position
 * @returns 
 */
function findPath(troop, pos) {
    const results = [];
    let current = troop.pos;
    for (const line of mode.map.lines) {
        if (!line.blocks)
            continue;
        const crossing = line.closestCrossing(troop, current, pos);
        if (crossing) // Null if no collision
            results.push(crossing.pos);
    }
    results.push(pos);
    results.sort((a, b) =>
        b.distanceTo(troop.pos) - a.distanceTo(troop.pos)
    );
    return results;
}

// UNUSED
/**
 * Checks if an object is an obstacle in the troop's path
 * @param {Troop} troop                         troop moving
 * @param {Troop|MapObject|LineObject} obstacle obstacle to check
 * @returns 
 */
function isPathObstacle(troop, obstacle) {
    // Long map features should always be considered if they are marked as blocking
    if (obstacle instanceof LineObject && obstacle.blocks)
        return true;

    // Ignore small objects that can be destroyed or walked around.
    if (obstacle instanceof MapObject && obstacle.blocks) {
        return obstacle.size >= troop.base.size * 2 && (!obstacle.destructible || obstacle.destructible > troop.base.mass);
    }

    // Only plan around large, static troops.
    if (obstacle instanceof Troop) {
        return obstacle.health > 0
            && obstacle.base.static
            && obstacle.base.flying === troop.base.flying
            && obstacle.base.maxSize >= troop.base.size * 2;
    }

    return false;
}

/**
 * Checks whether a position is blocked for a troop.
 * @param {Troop} troop
 * @param {Position} pos
 * @param {(Troop|MapObject|LineObject)[]} obstacles
 * @returns {boolean}
 */
function isPositionBlocked(troop, pos, obstacles) {
    for (const obstacle of obstacles) {
        if (!isPathObstacle(troop, obstacle))
            continue;

        if (obstacle instanceof MapObject) {
            if (obstacle.collides(pos, troop))
                return true;
        }

        else if (obstacle instanceof LineObject) {
            // Includes your existing ford logic.
            if (obstacle.collides(pos, troop))
                return true;
        }

        else if (obstacle instanceof Troop) {
            const minDistance =
                troop.base.maxSize + obstacle.base.maxSize;

            if (pos.distanceTo(obstacle.pos) < minDistance)
                return true;
        }
    }

    return false;
}

    // const obstacles = new Set([
    //     ...mode.map.grid.query(
    //         x,
    //         y,
    //         r
    //     ),
    //     ...mode.map.lines,
    //     ...mode.queryPos(mPos, r, troop.squad, false).filter(trp => isPathObstacle(troop, trp))
    // ].filter(obj => isPathObstacle(troop, obj)));