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